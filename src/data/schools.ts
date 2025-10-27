export interface SchoolOption {
  id: string;
  name: string;
  district: string;
}

export const zimbabweSchools: SchoolOption[] = [
  { id: 'hre001', name: 'Harare High School', district: 'Harare' },
  { id: 'hre002', name: 'St. Mary\'s High School', district: 'Harare' },
  { id: 'hre003', name: 'Arundel School', district: 'Harare' },
  { id: 'hre004', name: 'Prince Edward School', district: 'Harare' },
  { id: 'hre005', name: 'Girls High School Harare', district: 'Harare' },
  { id: 'hre006', name: 'Gateway High School', district: 'Harare' },
  { id: 'hre007', name: 'Allan Wilson School', district: 'Harare' },
  { id: 'hre008', name: 'Mater Dei High School', district: 'Harare' },
  
  { id: 'byo001', name: 'Christian Brothers College', district: 'Bulawayo' },
  { id: 'byo002', name: 'Girls High School Bulawayo', district: 'Bulawayo' },
  { id: 'byo003', name: 'Hamilton High School', district: 'Bulawayo' },
  { id: 'byo004', name: 'St. Bernard\'s High School', district: 'Bulawayo' },
  
  { id: 'chit001', name: 'Chitungwiza Secondary School', district: 'Chitungwiza' },
  { id: 'chit002', name: 'St. Mary\'s Chitungwiza', district: 'Chitungwiza' },
  
  { id: 'mt001', name: 'Mthwakazi High School', district: 'Matabeleland' },
  { id: 'mt002', name: 'Inyathi High School', district: 'Matabeleland' },
  
  { id: 'ms001', name: 'Masvingo High School', district: 'Masvingo' },
  { id: 'ms002', name: 'Great Zimbabwe High School', district: 'Masvingo' },
  
  { id: 'mut001', name: 'Mutare Boys High School', district: 'Mutare' },
  { id: 'mut002', name: 'Girls High School Mutare', district: 'Mutare' },
  { id: 'mut003', name: 'Mutare Girls High School', district: 'Mutare' },
  
  { id: 'gw001', name: 'Gweru High School', district: 'Gweru' },
  { id: 'gw002', name: 'Midlands Christian School', district: 'Gweru' },
  
  { id: 'kad001', name: 'Kadoma High School', district: 'Kadoma' },
  { id: 'kad002', name: 'Marist Brothers Kadoma', district: 'Kadoma' },
];

export default zimbabweSchools;
