import { Elysia, t } from "elysia";
import { AccountTools, Keystore, VulcanHebe } from "vulcan-api-js";
import { Grade, LuckyNumber } from "vulcan-api-js/lib/models";
import secrets from "../secrets";

const tags = ["🌋 Vulcan"];

const keystore = new Keystore();
keystore.loadFromObject({ certificate: secrets.certificate, fingerprint: secrets.fingerprint, privateKey: secrets.privateKey, firebaseToken: secrets.firebaseToken, deviceModel: secrets.deviceModel });

const client = new VulcanHebe(keystore, AccountTools.loadFromObject({ loginId: parseInt(secrets.loginId), userLogin: secrets.userLogin, userName: secrets.userName, restUrl: secrets.restUrl }));
console.log("🌋 Vulcan client initialized");

const students = await client.getStudents();
await client.selectStudent(students[0]);
console.log(`🎓 Selected student: ${students[0].pupil.firstName} ${students[0].pupil.surname}`);

const _vulcan = (app: Elysia) =>
    app
        .get(
            "/luckyNumber",
            async () => {
                const luckyNumber: LuckyNumber = await client.getLuckyNumber();
                if (luckyNumber.number === "0" || new Date(luckyNumber.day).getTime() === 0) return { number: null, day: null };
                return { number: luckyNumber.number, day: luckyNumber.day };
            },
            { detail: { tags, summary: "Get the school's lucky number for today.", description: "Returns null if it's the weekend or a day off." } }
        )
        .get(
            "/grades",
            async ({ query }) => {
                const lastSync = new Date(query.lastSync ?? 0);
                const grades: Grade[] = await client.getGrades(!isNaN(lastSync.getTime()) ? lastSync : new Date(0));
                return grades;
            },
            {
                query: t.Object({
                    lastSync: t.Optional(t.String()),
                }),
                detail: { tags, summary: `Get the currently selected student's grades (${students[0].pupil.firstName} ${students[0].pupil.surname.substring(0, 1)}.)` },
            }
        );

export default _vulcan;
