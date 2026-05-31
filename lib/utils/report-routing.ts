import type { CrimeReport } from '@/lib/types';

export function principalOwner(report: CrimeReport) {
  if (isWardenResidentialReport(report)) return 'Warden';
  if (isConductReport(report)) return 'Dean';
  if (isSecurityReport(report)) return 'CSO';
  return 'Unrouted';
}

export function isSecurityReport(report: CrimeReport) {
  const normalized = `${report.crimeType} ${report.description}`.toLowerCase();
  return containsAny(normalized, ['theft', 'robbery', 'assault', 'fight', 'weapon', 'suspicious', 'violence']);
}

export function isConductReport(report: CrimeReport) {
  const normalized = `${report.crimeType} ${report.description}`.toLowerCase();
  return containsAny(normalized, ['harassment', 'cyberbullying', 'misconduct', 'discipline', 'academic', 'exam', 'substance', 'contraband', 'bullying', 'threat']);
}

export function isWardenResidentialReport(report: CrimeReport) {
  if (!report.isHostelIncident) return false;
  const incidentType = report.crimeType.toLowerCase();
  if (containsAny(incidentType, ['theft', 'robbery', 'assault', 'altercation', 'harassment', 'cyberbullying', 'substance', 'contraband', 'weapon', 'threat', 'fight', 'bullying', 'academic', 'exam'])) return false;

  const normalized = `${report.crimeType} ${report.description}`.toLowerCase();
  return containsAny(normalized, ['welfare', 'maintenance', 'repair', 'damage', 'property damage', 'vandal', 'broken', 'leak', 'water', 'electric', 'plumbing', 'sanitation', 'toilet', 'bathroom', 'facility', 'room allocation', 'occupancy', 'occupant', 'roommate', 'bedspace', 'hostel rule', 'noise', 'cleanliness']);
}

function containsAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}
