import { readInputFrom, toLines } from '../__fixtures__';

describe('02', () => {

    type Report = [number, number, ...number];
    const EXAMPLE = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

    const MAX_STEP = 3;
    function safeGap(from: number, to: number, asc?: boolean) {
        const gap = Math.abs(from - to);
        if (gap < 1 || gap > 3) {
            return false;
        }
        if (asc === true && from > to) {
            return false
        }
        if (asc === false && from < to) {
            return false
        }
        return true;
    }

    function parse(input: string): Report[] {
        const reports: Report[] = toLines(input.trim()).map(line => line.split(/\D+/).map(Number));
        reports.forEach(
            report => {
                if (report.length < 2) {
                    throw new Error(`Report too short`);
                }
            }
        );
        return reports;
    }

    function safeReport(report: Report, dampener = 0) {
        if (report.length < 2 || !safeGap(report[0], report[1])) {
            return false;
        }
        const asc = report[0] < report[1];
        for (let previous = report[0], index = 1; index < report.length; index++) {
            if (!safeGap(previous, report[index], asc)) {
                if (!dampener--) {
                    return false;
                }
                continue;
            }
            previous = report[index];
        }
        return true;
    }

    function walkReport(report: Report, ascending = true, dampening = 1) {
        for (let previous = report[0], index = 1; index < report.length; index++) {
            if (!safeGap(previous, report[index], ascending)) {
                if (dampening > 0) {
                    const newReport: Report = [...report];
                    newReport.splice(index, 1);
                    return walkReport(newReport, ascending, dampening - 1);
                }
                return false;
            }
            previous = report[index];
        }
        return true;
    }

    function isSafe(report: Report) {

    }

    function dampReports(reports: Report[]) {
        const safe: Report[] = [];
        const unsafe: Report[] = []
        reports.forEach(report => {
            if (walkReport(report, true) || walkReport(report, false)) {
                safe.push(report);
            }
            else {
                unsafe.push(report);
                console.log(report);
            }
        });

        return {
            safe, unsafe
        }
    }

    // function explodeReports(reports: Report[]) {
    //     const safe: Report[] = [];
    //     const unsafe: Report[] = [];
    //     reports.forEach(report => {
    //         if(walkReport(report, true, 0) || walkReport(report, false, 0)) {
    //             return void(safe.push(report));
    //         }
    //
    //         report
    //     })
    //
    // }

    function explode(report: Report): Report[] {
        const out = [
            report,
            report.reverse(),
        ]
        return [report];
    }

    it('example.1', () => {
        const reports = parse(EXAMPLE);
        const safe = reports.filter(report => safeReport(report));

        expect(safe.length).toBe(2);
    });

    it('q.1', () => {
        const reports = parse(readInputFrom(2024, 2, 'input'));
        const safe = reports.filter(report => safeReport(report));

        expect(safe.length).toBe(218);
    });

    it('example.2', () => {
        const reports = parse(EXAMPLE);
        const damp = dampReports(reports);

        expect(damp.safe.length).toBe(4);
    });

    it('q.2', () => {
        const reports = parse(readInputFrom(2024, 2, 'input'));
        const damp = dampReports(reports);

        expect(damp.safe.length).toBe(218);
    });

})