import mongoose from 'mongoose';
import { ENV } from '../config/env';
import { Lead } from '../models/Lead.model';
import { User } from '../models/User.model';
import { LeadStatus, LeadSource, UserRole } from '../constants/enums';

const requiredSeedValue = (key: string): string => {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`Missing required seed environment variable: ${key}`);
  return value;
};

const seedLeads = async () => {
  await mongoose.connect(ENV.MONGODB_URI);

  const adminName = requiredSeedValue('ADMIN_NAME');
  const adminEmail = requiredSeedValue('ADMIN_EMAIL');
  const adminPassword = requiredSeedValue('ADMIN_PASSWORD');

  if (adminName.length < 2) throw new Error('ADMIN_NAME must be at least 2 characters');
  if (adminPassword.length < 6) throw new Error('ADMIN_PASSWORD must be at least 6 characters');

  let admin = await User.findOne({ email: adminEmail }).select('+password');

  if (admin) {
    admin.name = adminName;
    admin.password = adminPassword;
    admin.role = UserRole.ADMIN;
    await admin.save();
  } else {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: UserRole.ADMIN,
    });
  }

  const leads = [
    { name: 'Amit Kumar', email: 'amit@test.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE },
    { name: 'Sneha Patel', email: 'sneha@test.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL },
    { name: 'Rahul Singh', email: 'rsingh@test.com', status: LeadStatus.LOST, source: LeadSource.INSTAGRAM },
    { name: 'Rahul Verma', email: 'rverma@test.com', status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM },
    { name: 'Deepa Nair', email: 'deepa@test.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE },
    { name: 'Karan Mehta', email: 'karan@test.com', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL },
    { name: 'Pooja Iyer', email: 'pooja@test.com', status: LeadStatus.CONTACTED, source: LeadSource.INSTAGRAM },
    { name: 'Vikram Das', email: 'vikram@test.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE },
    { name: 'Ananya Roy', email: 'ananya@test.com', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE },
    { name: 'Rohan Gupta', email: 'rohan@test.com', status: LeadStatus.LOST, source: LeadSource.REFERRAL },
    { name: 'Meera Joshi', email: 'meera@test.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM },
    { name: 'Arjun Nair', email: 'arjun@test.com', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE },
  ];

  const leadsWithUser = leads.map(l => ({ ...l, createdBy: admin._id }));
  const existingLeadCount = await Lead.countDocuments();

  if (existingLeadCount === 0) {
    await Lead.insertMany(leadsWithUser);
    console.log(`Seeded ${leads.length} leads successfully`);
  } else {
    console.log(`Skipped lead seeding because ${existingLeadCount} leads already exist`);
  }

  console.log(`Admin user ready: ${adminEmail}`);
  process.exit(0);
};

seedLeads().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
