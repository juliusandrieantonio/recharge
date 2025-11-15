const admin = require('firebase-admin');

if (!admin.apps.length) {
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, data } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // 1. Create Firebase user (WITHOUT signing in client)
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    const uid = userRecord.uid;

    // 2. Save user data in RTDB
    await admin.database().ref(`users/${uid}`).set({
      ...data,
      role: 'recycling',
      total_bottles_collected: data?.total_bottles_collected || 0,
      status: data?.status || 'active'
    });

    // 3. Save phone number lookup
    if (data?.phone_number) {
      await admin.database().ref(`phone_numbers/${data.phone_number}`).set(email);
    }

    return res.status(200).json({ success: true, uid });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ error: (err as Error).message || 'Unknown error' });
  }
};