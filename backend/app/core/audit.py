"""
Audit logging system for security events and admin actions.
Logs are append-only and include all critical security events.
"""
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import Request
from config import settings


class AuditLogger:
    """Centralized audit logging for security events."""
    
    def __init__(self):
        self.enabled = settings.AUDIT_LOG_ENABLED
        if self.enabled:
            # Create logs directory if it doesn't exist
            log_path = Path(settings.AUDIT_LOG_FILE)
            log_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Configure audit logger
            self.logger = logging.getLogger("audit")
            self.logger.setLevel(logging.INFO)
            
            # File handler with append mode (never truncate)
            handler = logging.FileHandler(settings.AUDIT_LOG_FILE, mode='a')
            handler.setFormatter(logging.Formatter('%(message)s'))
            self.logger.addHandler(handler)
            
            # Prevent propagation to root logger
            self.logger.propagate = False

    def _log_event(
        self,
        event_type: str,
        user_id: Optional[str],
        action: str,
        result: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[dict] = None
    ):
        """Internal method to log an audit event."""
        if not self.enabled:
            return
        
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "action": action,
            "result": result,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "details": details or {}
        }
        
        self.logger.info(json.dumps(event))

    def log_login_success(self, user_id: str, request: Request):
        """Log successful login."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="login",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_login_failure(self, email: str, request: Request, reason: str = "invalid_credentials"):
        """Log failed login attempt."""
        self._log_event(
            event_type="auth",
            user_id=None,
            action="login",
            result="failure",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"email": email, "reason": reason}
        )

    def log_logout(self, user_id: str, request: Request):
        """Log user logout."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="logout",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_token_refresh(self, user_id: str, request: Request):
        """Log token refresh."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="token_refresh",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_password_change(self, user_id: str, request: Request):
        """Log password change."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="password_change",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_password_reset_request(self, email: str, request: Request):
        """Log password reset request."""
        self._log_event(
            event_type="auth",
            user_id=None,
            action="password_reset_request",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"email": email}
        )

    def log_password_reset_complete(self, user_id: str, request: Request):
        """Log password reset completion."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="password_reset_complete",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_mfa_enabled(self, user_id: str, request: Request):
        """Log MFA enablement."""
        self._log_event(
            event_type="security",
            user_id=user_id,
            action="mfa_enabled",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_mfa_disabled(self, user_id: str, request: Request):
        """Log MFA disablement."""
        self._log_event(
            event_type="security",
            user_id=user_id,
            action="mfa_disabled",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_mfa_verification_success(self, user_id: str, request: Request):
        """Log successful MFA verification."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="mfa_verification",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_mfa_verification_failure(self, user_id: str, request: Request):
        """Log failed MFA verification."""
        self._log_event(
            event_type="auth",
            user_id=user_id,
            action="mfa_verification",
            result="failure",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    def log_user_created(self, admin_user_id: str, created_user_id: str, request: Request):
        """Log user creation by admin."""
        self._log_event(
            event_type="admin",
            user_id=admin_user_id,
            action="user_created",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"created_user_id": created_user_id}
        )

    def log_user_deleted(self, admin_user_id: str, deleted_user_id: str, request: Request):
        """Log user deletion by admin."""
        self._log_event(
            event_type="admin",
            user_id=admin_user_id,
            action="user_deleted",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"deleted_user_id": deleted_user_id}
        )

    def log_role_changed(self, admin_user_id: str, target_user_id: str, old_role: str, new_role: str, request: Request):
        """Log role change by admin."""
        self._log_event(
            event_type="admin",
            user_id=admin_user_id,
            action="role_changed",
            result="success",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={
                "target_user_id": target_user_id,
                "old_role": old_role,
                "new_role": new_role
            }
        )

    def log_access_denied(self, user_id: Optional[str], resource: str, request: Request):
        """Log access denied event."""
        self._log_event(
            event_type="security",
            user_id=user_id,
            action="access_denied",
            result="failure",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"resource": resource}
        )


# Global audit logger instance
audit_logger = AuditLogger()
