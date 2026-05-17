import { parse as json2csvParse, FieldOption } from 'json2csv';
import { ILead } from '../interfaces';

type LeadCsvRow = {
  Name: string;
  Email: string;
  Status: string;
  Source: string;
  'Created At': string;
};

const CSV_FIELDS: FieldOption[] = [
  { label: 'Name', value: 'Name' },
  { label: 'Email', value: 'Email' },
  { label: 'Status', value: 'Status' },
  { label: 'Source', value: 'Source' },
  { label: 'Created At', value: 'Created At' },
];

export const exportLeadsToCSV = (leads: ILead[]): string => {
  if (leads.length === 0) return '';

  const rows: LeadCsvRow[] = leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    'Created At': lead.createdAt.toISOString(),
  }));

  return json2csvParse(rows, { fields: CSV_FIELDS });
};
