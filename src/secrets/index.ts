interface Secrets {
    mongoUri: string;
    certificate: string;
    fingerprint: string;
    privateKey: string;
    firebaseToken: string;
    deviceModel: string;
    loginId: string;
    userLogin: string;
    userName: string;
    restUrl: string;
}

const secrets: Secrets = {
    mongoUri: process.env.MONGO_URI ?? "",
    certificate: process.env.CERTIFICATE ?? "",
    fingerprint: process.env.FINGERPRINT ?? "",
    privateKey: process.env.PRIVATE_KEY ?? "",
    firebaseToken: process.env.FIREBASE_TOKEN ?? "",
    deviceModel: process.env.DEVICE_MODEL ?? "",
    loginId: process.env.LOGIN_ID ?? "",
    userLogin: process.env.USER_LOGIN ?? "",
    userName: process.env.USER_NAME ?? "",
    restUrl: process.env.REST_URL ?? "",
};

if (Object.values(secrets).includes("")) throw new Error("Not all environment variables are set.");

export default secrets;
