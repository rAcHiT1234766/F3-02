export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'on-leave' | 'archived';
  startDate: string;
};
export const departments = ['Engineering', 'Design', 'Operations', 'People', 'Finance'];
export function createEmployees(count = 50): Employee[] {
  const first = [
    'Alex',
    'Sam',
    'Taylor',
    'Jordan',
    'Casey',
    'Robin',
    'Avery',
    'Jamie',
    'Drew',
    'Morgan',
  ];
  const last = ['Rivera', 'Chen', 'Patel', 'Reed', 'Brooks'];
  return Array.from({ length: count }, (_, index) => ({
    id: `employee-${index + 1}`,
    name: `${first[index % first.length]} ${last[Math.floor(index / first.length) % last.length]}${index >= 50 ? ` ${index + 1}` : ''}`,
    email: `employee${index + 1}@example.com`,
    department: departments[index % departments.length]!,
    status: index % 9 === 0 ? 'on-leave' : 'active',
    startDate: `202${4 + (index % 3)}-${String(1 + (index % 12)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`,
  }));
}
