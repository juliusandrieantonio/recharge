const admin = require('firebase-admin');
const allowedOrigins = [
  'https://recharge-git-develop-julius-projects-173ae70a.vercel.app',
  'https://recharge-zeta.vercel.app'
];

if (!admin.apps.length) {
  console.log({
    projectId: process.env['FIREBASE_PROJECT_ID'],
    clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
    privateKeyExists: !!process.env['FIREBASE_PRIVATE_KEY'],
    databaseURL: process.env['FIREBASE_DATABASE_URL']
  });
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env['FIREBASE_PROJECT_ID'],
      clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
      privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env['FIREBASE_DATABASE_URL'],
  });
}

module.exports = async function (req: any, res: any) {
  // Set CORS headers
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, data } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Create Firebase user
    const userRecord = await admin.auth().createUser({ email, password });
    const uid = userRecord.uid;

    // Save user data in Realtime Database
    await admin.database().ref(`users/${uid}`).set({
      ...data,
      role: 'recycling',
      total_bottles_collected: data?.total_bottles_collected || 0,
      status: data?.status || 'active'
    });

    // Save phone number lookup
    if (data?.phone_number) {
      await admin.database().ref(`phone_numbers/${data.phone_number}`).set(email);
    }

    return res.status(200).json({ success: true, uid });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};