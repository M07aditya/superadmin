import { AuditLog } from '../models/index.js';

export async function logAudit(actorUserId, action, targetType, targetId, details = {}) {
  try {
    await AuditLog.create({ actorUserId, action, targetType, targetId, details, timestamp: new Date() });
  } catch (e) {
    console.error('Audit log error', e.message);
  }
}
