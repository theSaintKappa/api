import { Elysia, t } from "elysia";
import { AccountTools, Keystore, VulcanHebe } from "vulcan-api-js";
import type { Grade, LuckyNumber } from "vulcan-api-js/lib/models";

const tags = ["🌋 Vulcan"];

const keystore = new Keystore();
keystore.loadFromJsonString(await Bun.file("keystore.json").text());

const vulcan = new VulcanHebe(keystore, AccountTools.loadFromJsonString(await Bun.file("account.json").text()));
console.log("🌋 Vulcan client initialized");
const students = await vulcan.getStudents();
await vulcan.selectStudent(students[0]);
console.log(`🎓 Selected student: ${students[0].pupil.firstName} ${students[0].pupil.surname}`);

const _vulcan = (app: Elysia) => {
    return app
        .get(
            "/luckyNumber",
            async () => {
                const luckyNumber: LuckyNumber = await vulcan.getLuckyNumber();
                if (luckyNumber.number === "0" || new Date(luckyNumber.day).getTime() === 0) return { number: null, day: null };
                return { number: luckyNumber.number, day: luckyNumber.day };
            },
            { detail: { tags, summary: "Get the school's lucky number for today.", description: "Returns null if it's the weekend or a day off." } }
        )
        .get(
            "/grades",
            async ({ query }) => {
                const lastSync = new Date(query.lastSync ?? 0);
                const grades: Grade[] = await vulcan.getGrades(!isNaN(lastSync.getTime()) ? lastSync : new Date(0));
                return grades;
            },
            {
                query: t.Object({
                    lastSync: t.Optional(t.String()),
                }),
                detail: { tags, summary: `Get the currently selected student's grades (${students[0].pupil.firstName} ${students[0].pupil.surname.substring(0, 1)}.)` },
            }
        );
};

export default _vulcan;
