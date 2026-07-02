const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const semesterOneWeeks = range(6, 17);
const semesterTwoWeeks = [...range(24, 33), 36, 37];

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildConsecutiveWeeks({ semester, firstNumber, count, firstDate }) {
  const first = new Date(`${firstDate}T12:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const start = new Date(first);
    const end = new Date(first);
    start.setUTCDate(first.getUTCDate() + index * 7);
    end.setUTCDate(first.getUTCDate() + index * 7 + 6);
    return {
      semester,
      number: firstNumber + index,
      start: isoDate(start),
      end: isoDate(end),
    };
  });
}

export const teachingWeeks = [
  ...buildConsecutiveWeeks({
    semester: 1,
    firstNumber: 6,
    count: 12,
    firstDate: "2026-09-07",
  }),
  ...buildConsecutiveWeeks({
    semester: 2,
    firstNumber: 24,
    count: 10,
    firstDate: "2027-01-11",
  }),
  ...buildConsecutiveWeeks({
    semester: 2,
    firstNumber: 36,
    count: 2,
    firstDate: "2027-04-05",
  }),
];

// Names and elective classifications: Notion "Modules" database, retrieved 2 July 2026.
export const moduleCatalog = {
  AC2202: { name: "Intermediate Management Accounting 1", elective: false },
  AC2206: { name: "Investment Appraisal", elective: true },
  EC2204: { name: "Business Microeconomics 1", elective: false },
  FE1200: {
    name: "Introduction to Sustainable Food Marketing Channels and Supply Chains",
    elective: true,
  },
  IS2204: { name: "Visual Thinking for Systems Analysis & Design", elective: false },
  IS2205: {
    name: "Unlocking Data Opportunities: A Visual and Relational Approach",
    elective: false,
  },
  IS2206: { name: "Introduction to Databases", elective: false },
  IS2207: { name: "Relational Database Development", elective: false },
  IS2208: { name: "Test Driven Development", elective: false },
  IS2209: { name: "Application Integration and Deployment", elective: false },
  IS2215: { name: "Design Thinking and Visual Prototyping", elective: false },
  IS2217: { name: "Personal Development for BIS Professionals", elective: false },
  MG2001: { name: "People and Organisation", elective: true },
  MG2003: { name: "Consumer Behaviour and Sustainable Consumption", elective: true },
  MG2007: { name: "Enterprise Planning and Processes", elective: true },
  MG2008: { name: "Business Ethics and Governance", elective: true },
  MG3021: { name: "Market Research", elective: true },
};

const event = (
  id,
  semester,
  module,
  kind,
  day,
  start,
  end,
  room,
  weeks,
  group = null,
) => ({
  id,
  semester,
  module,
  kind,
  group,
  day,
  start,
  end,
  room,
  weeks,
});

export const events = [
  event("s1-is2208-t-mon-a", 1, "IS2208", "Tutorial", 1, "13:00", "14:00", "ORB_BIS", semesterOneWeeks, "A"),
  event("s1-is2217-l-mon", 1, "IS2217", "Lecture", 1, "13:00", "14:00", "BHSC_G02*", [6]),
  event("s1-is2204-l-mon", 1, "IS2204", "Lecture", 1, "16:00", "17:00", "GG_LT", semesterOneWeeks),
  event("s1-is2208-l-mon", 1, "IS2208", "Lecture", 1, "17:00", "18:00", "GG_LT", semesterOneWeeks),

  event("s1-ec2204-l-tue", 1, "EC2204", "Lecture", 2, "09:00", "10:00", "BOOLE_3", [...range(6, 13), ...range(15, 17)]),
  event("s1-is2208-t-tue-a", 1, "IS2208", "Tutorial", 2, "10:00", "11:00", "ORB_BIS", semesterOneWeeks, "A"),
  event("s1-is2206-t-tue", 1, "IS2206", "Tutorial", 2, "11:00", "12:00", "D_ORB_1.112", semesterOneWeeks),
  event("s1-is2208-l-tue", 1, "IS2208", "Lecture", 2, "14:00", "15:00", "GG_LT", semesterOneWeeks),
  event("s1-is2208-t-tue-b", 1, "IS2208", "Tutorial", 2, "15:00", "16:00", "ORB_BIS", semesterOneWeeks, "B"),
  event("s1-mg2008-l-tue", 1, "MG2008", "Lecture", 2, "16:00", "18:00", "BOOLE_4", semesterOneWeeks),

  event("s1-is2208-t-wed-b", 1, "IS2208", "Tutorial", 3, "09:00", "10:00", "ORB_BIS", semesterOneWeeks, "B"),
  event("s1-is2217-l-wed", 1, "IS2217", "Lecture", 3, "10:00", "12:00", "ELD5_G01", range(7, 17)),
  event("s1-is2206-l-wed", 1, "IS2206", "Lecture", 3, "13:00", "14:00", "GG_LT", range(6, 11)),
  event("s1-is2206-t-wed-15", 1, "IS2206", "Tutorial", 3, "15:00", "16:00", "D_ORB_1.112", semesterOneWeeks),
  event("s1-is2206-t-wed-16", 1, "IS2206", "Tutorial", 3, "16:00", "17:00", "D_ORB_1.112", semesterOneWeeks),
  event("s1-mg2001-l-wed", 1, "MG2001", "Lecture", 3, "17:00", "18:00", "BOOLE_3", semesterOneWeeks),
  event("s1-fe1200-l-wed", 1, "FE1200", "Lecture", 3, "17:00", "18:00", "WW_6", range(7, 17)),

  event("s1-fe1200-l-thu", 1, "FE1200", "Lecture", 4, "09:00", "11:00", "CONN_S5", range(7, 17)),
  event("s1-is2206-t-thu", 1, "IS2206", "Tutorial", 4, "10:00", "11:00", "D_ORB_1.112", semesterOneWeeks),
  event("s1-is2206-l-thu", 1, "IS2206", "Lecture", 4, "11:00", "12:00", "WGB_107", semesterOneWeeks),
  event("s1-mg3021-l-thu", 1, "MG3021", "Lecture", 4, "12:00", "14:00", "BOOLE_2", semesterOneWeeks),
  event("s1-mg2001-l-thu", 1, "MG2001", "Lecture", 4, "15:00", "16:00", "BOOLE_4", semesterOneWeeks),
  event("s1-is2204-l-thu", 1, "IS2204", "Lecture", 4, "16:00", "17:00", "KANE_G01", semesterOneWeeks),

  event("s1-ac2206-l-fri", 1, "AC2206", "Lecture", 5, "13:00", "15:00", "BOOLE_1", semesterOneWeeks),
  event("s1-ec2204-l-fri", 1, "EC2204", "Lecture", 5, "15:00", "16:00", "BOOLE_3", semesterOneWeeks),

  event("s2-is2207-l-mon", 2, "IS2207", "Lecture", 1, "11:00", "12:00", "WGB_107", semesterTwoWeeks),
  event("s2-is2207-t-mon-b", 2, "IS2207", "Tutorial", 1, "10:00", "11:00", "ORB_G80", semesterTwoWeeks, "B"),
  event("s2-is2207-t-mon-a", 2, "IS2207", "Tutorial", 1, "12:00", "13:00", "ORB_G80", semesterTwoWeeks, "A"),
  event("s2-is2215-l-mon", 2, "IS2215", "Lecture", 1, "13:00", "15:00", "KANE_G01", semesterTwoWeeks),
  event("s2-is2217-l-mon", 2, "IS2217", "Lecture", 1, "15:00", "16:00", "WGB_G05", [24]),
  event("s2-is2209-l-mon", 2, "IS2209", "Lecture", 1, "17:00", "19:00", "BOOLE_3", semesterTwoWeeks),

  event("s2-is2209-t-tue-a", 2, "IS2209", "Tutorial", 2, "10:00", "11:00", "ORB_G80", semesterTwoWeeks, "A"),
  event("s2-is2207-t-tue-a", 2, "IS2207", "Tutorial", 2, "11:00", "12:00", "ORB_G80", semesterTwoWeeks, "A"),
  event("s2-ac2202-l-tue", 2, "AC2202", "Lecture", 2, "14:00", "15:00", "BOOLE_2", semesterTwoWeeks),
  event("s2-is2209-t-tue-b", 2, "IS2209", "Tutorial", 2, "15:00", "16:00", "ORB_G80", semesterTwoWeeks, "B"),

  event("s2-is2209-t-wed-b", 2, "IS2209", "Tutorial", 3, "09:00", "10:00", "ORB_G80", semesterTwoWeeks, "B"),
  event("s2-is2207-t-wed-b", 2, "IS2207", "Tutorial", 3, "12:00", "13:00", "ORB_G80", semesterTwoWeeks, "B"),
  event("s2-mg2007-l-wed", 2, "MG2007", "Lecture", 3, "13:00", "14:00", "BOOLE_3", semesterTwoWeeks),
  event("s2-ac2202-l-wed", 2, "AC2202", "Lecture", 3, "15:00", "16:00", "BOOLE_1", semesterTwoWeeks),

  event("s2-is2207-l-thu", 2, "IS2207", "Lecture", 4, "11:00", "12:00", "AL_G30*", semesterTwoWeeks),
  event("s2-is2209-t-thu-a", 2, "IS2209", "Tutorial", 4, "13:00", "14:00", "ORB_G80", semesterTwoWeeks, "A"),
  event("s2-is2205-l-thu", 2, "IS2205", "Lecture", 4, "16:00", "18:00", "KANE_G01", semesterTwoWeeks),

  event("s2-is2217-l-fri", 2, "IS2217", "Lecture", 5, "10:00", "13:00", "CONN_S3", semesterTwoWeeks),
  event("s2-mg2003-l-fri", 2, "MG2003", "Lecture", 5, "14:00", "16:00", "BOOLE_3", semesterTwoWeeks),
  event("s2-mg2007-l-fri", 2, "MG2007", "Lecture", 5, "16:00", "17:00", "BOOLE_3", semesterTwoWeeks),
];

export const academicCalendar = [
  { date: "2026-09-07", label: "Academic year begins for second years and beyond", type: "term" },
  { date: "2026-09-14", label: "Academic year begins for first years", type: "term" },
  { date: "2026-10-26", label: "Public holiday - no lectures", type: "public-holiday" },
  { date: "2026-11-27", label: "Semester 1 lectures end for second years and beyond", type: "term" },
  { date: "2026-11-30", end: "2026-12-06", label: "Semester 1 study period", type: "study" },
  { date: "2026-12-07", label: "Winter examinations begin for second years and beyond", type: "exam" },
  { date: "2026-12-14", label: "Winter examinations begin for first years", type: "exam" },
  { date: "2026-12-18", label: "Winter examinations end", type: "exam" },
  { date: "2026-12-18", end: "2027-01-10", label: "Christmas recess", type: "recess" },
  { date: "2027-01-11", label: "Semester 2 lectures begin", type: "term" },
  { date: "2027-02-01", label: "St Brigid's Day - no lectures", type: "public-holiday" },
  { date: "2027-03-17", label: "St Patrick's Day - no lectures", type: "public-holiday" },
  { date: "2027-03-19", end: "2027-04-02", label: "Easter recess", type: "recess" },
  { date: "2027-03-30", label: "Last week of Semester 2", type: "term" },
  { date: "2027-04-19", end: "2027-04-29", label: "Semester 2 study period", type: "study" },
  { date: "2027-04-30", label: "Summer examinations begin", type: "exam" },
  { date: "2027-05-03", label: "Public holiday - no examinations", type: "public-holiday" },
  { date: "2027-05-14", label: "Summer examinations end", type: "exam" },
  { date: "2027-05-31", label: "Summer recess begins", type: "recess" },
  { date: "2027-07-30", label: "Autumn repeat examinations begin", type: "exam" },
  { date: "2027-08-03", label: "Public holiday - no lectures", type: "public-holiday" },
  { date: "2027-08-13", label: "Autumn repeat examinations end", type: "exam" },
  { date: "2027-09-06", label: "Provisional 2027-28 start for second years and beyond", type: "term" },
  { date: "2027-09-13", label: "Provisional 2027-28 start for first years", type: "term" },
];

export const undatedMilestones = [
  "Start of winter supplemental repeat examinations (Final Medical students only)",
  "End of winter supplemental repeat examinations (Final Medical students only)",
  "Start of Spring Examinations",
  "End of Spring Examinations",
];
