const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onMarketplaceReportUploaded = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name || '';
  if (!filePath.startsWith('uploads/')) return null;
  const [, userId, marketplace = 'unknown', reportType = 'unknown'] = filePath.split('/');
  await admin.firestore().collection('alerts').add({
    userId,
    marketplace,
    reportType,
    type: 'file_received',
    severity: 'info',
    message: `${marketplace} ${reportType} report is queued for parsing and reconciliation.`,
    storagePath: filePath,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return null;
});
