const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaints_db';
    console.log(`Connecting to Local MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to Local MongoDB successfully!');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing collections...');

    // 1. Create Requested Users: Abdul(Student), Karan(Student), Sohaib(Admin), Sahil(Resolver)
    const abdul = await User.create({
      name: 'Abdul',
      email: 'abdul@example.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: 'CS-2024-101',
      roomNumber: 'Hostel Block A, Room 204',
      phone: '+1 (555) 234-5678',
      avatar: '',
    });

    const karan = await User.create({
      name: 'Karan',
      email: 'karan@example.com',
      password: 'password123',
      role: 'student',
      department: 'Mechanical Engineering',
      studentId: 'ME-2024-055',
      roomNumber: 'Hostel Block B, Room 310',
      phone: '+1 (555) 345-6789',
      avatar: '',
    });

    const sahil = await User.create({
      name: 'Sahil',
      email: 'sahil@example.com',
      password: 'password123',
      role: 'staff',
      department: 'Maintenance & Infrastructure',
      phone: '+1 (555) 876-5432',
      avatar: '',
    });

    const sohaib = await User.create({
      name: 'Sohaib',
      email: 'sohaib@example.com',
      password: 'password123',
      role: 'admin',
      department: 'General Administration',
      phone: '+1 (555) 999-0000',
      avatar: '',
    });

    console.log('✅ Created Users:');
    console.log(' - Abdul (Student): abdul@example.com / password123');
    console.log(' - Karan (Student): karan@example.com / password123');
    console.log(' - Sahil (Resolver): sahil@example.com / password123');
    console.log(' - Sohaib (Admin): sohaib@example.com / password123');

    // 2. Create Relevant Complaints
    const c1 = await Complaint.create({
      ticketId: 'CMP-2026-1001',
      title: 'Hostel Room A-204 AC Compressor Failure & Sparking Socket',
      description:
        'The air conditioner stopped cooling and makes loud clicking noises. Additionally, the main electrical outlet next to study desk 1 showed visible sparks when plugging in a laptop charger. Poses an urgent electrical hazard.',
      category: 'Hostel',
      priority: 'Urgent',
      status: 'In Progress',
      location: 'Hostel Block A, Room 204',
      isAnonymous: false,
      publicToCampus: false,
      complainant: abdul._id,
      assignedTo: sahil._id,
      assignedDepartment: 'Maintenance & Infrastructure',
      activityLog: [
        {
          action: 'Complaint Registered',
          performedBy: abdul._id,
          performerName: abdul.name,
          note: 'Filed with Urgent priority.',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
        },
        {
          action: 'Complaint Assigned',
          performedBy: sohaib._id,
          performerName: sohaib.name,
          note: 'Assigned to Sahil (Maintenance & Infrastructure)',
          timestamp: new Date(Date.now() - 18 * 3600 * 1000),
        },
        {
          action: 'Status changed to In Progress',
          performedBy: sahil._id,
          performerName: sahil.name,
          note: 'Electrician dispatched with replacement 16A modular socket and capacitor.',
          timestamp: new Date(Date.now() - 6 * 3600 * 1000),
        },
      ],
      comments: [
        {
          user: sahil._id,
          message:
            'Hello Abdul, I have isolated the MCB circuit for room 204. Our maintenance electrician is on his way with replacement modular switchgear and AC refrigerant pressure gauge.',
          isStaffOnly: false,
          createdAt: new Date(Date.now() - 5 * 3600 * 1000),
        },
        {
          user: abdul._id,
          message:
            'Thanks Sahil! I will be in the room till 5 PM. Please also check the switchboard ground wire.',
          isStaffOnly: false,
          createdAt: new Date(Date.now() - 3 * 3600 * 1000),
        },
      ],
    });

    const c2 = await Complaint.create({
      ticketId: 'CMP-2026-1002',
      title: 'Computer Science Lab 3 High-Performance Workstation Thermal Throttling',
      description:
        'The deep learning workstations (Systems 14 to 20) in CS Lab 3 are shutting down abruptly due to CPU/GPU thermal overload during semester project simulations. The cooling fans seem heavily clogged with dust.',
      category: 'IT & Labs',
      priority: 'High',
      status: 'In Review',
      location: 'Turing Building, CS Lab 3',
      isAnonymous: false,
      publicToCampus: true,
      upvotes: [abdul._id, karan._id],
      complainant: abdul._id,
      assignedTo: sahil._id,
      assignedDepartment: 'IT & Labs',
      activityLog: [
        {
          action: 'Complaint Registered',
          performedBy: abdul._id,
          performerName: abdul.name,
          note: 'Reported lab systems thermal shutdown.',
          timestamp: new Date(Date.now() - 16 * 3600 * 1000),
        },
        {
          action: 'Status changed to In Review',
          performedBy: sahil._id,
          performerName: sahil.name,
          note: 'Scheduled thermal paste reapplication and blower cleanup.',
          timestamp: new Date(Date.now() - 8 * 3600 * 1000),
        },
      ],
      comments: [
        {
          user: sahil._id,
          message:
            'Inspected lab systems. We have requisitioned compressed air cans and thermal paste for Saturday routine maintenance.',
          isStaffOnly: false,
          createdAt: new Date(Date.now() - 4 * 3600 * 1000),
        },
      ],
    });

    const c3 = await Complaint.create({
      ticketId: 'CMP-2026-1003',
      title: 'Mechanical Workshop 3D Rapid Prototyping Printer Extruder Jam',
      description:
        'The Creality 3D printer in Room 108 had a blocked hotend nozzle and PTFE tube failure, stopping capstone project fabrication midway.',
      category: 'Academic',
      priority: 'Medium',
      status: 'Resolved',
      location: 'Mechanical Workshop, Room 108',
      isAnonymous: false,
      publicToCampus: false,
      complainant: karan._id,
      assignedTo: sahil._id,
      assignedDepartment: 'Maintenance & Infrastructure',
      resolutionDetails: {
        resolvedAt: new Date(Date.now() - 8 * 3600 * 1000),
        resolutionNote:
          'Replaced 0.4mm brass nozzle, cleared jammed heatbreak, installed new Capricorn PTFE tubing, and successfully ran 3DBenchy calibration test.',
        resolvedBy: sahil._id,
      },
      feedback: {
        rating: 5,
        comment:
          'Sahil fixed the extruder within 3 hours. Our capstone team completed fabrication on time. Fantastic response!',
        submittedAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      activityLog: [
        {
          action: 'Complaint Registered',
          performedBy: karan._id,
          performerName: karan.name,
          note: 'Extruder clogged.',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000),
        },
        {
          action: 'Status changed to In Progress',
          performedBy: sahil._id,
          performerName: sahil.name,
          note: 'Replacing nozzle and PTFE tube.',
          timestamp: new Date(Date.now() - 14 * 3600 * 1000),
        },
        {
          action: 'Status changed to Resolved',
          performedBy: sahil._id,
          performerName: sahil.name,
          note: 'Printer test print completed successfully.',
          timestamp: new Date(Date.now() - 8 * 3600 * 1000),
        },
        {
          action: 'Feedback Submitted',
          performedBy: karan._id,
          performerName: karan.name,
          note: 'Student gave 5-star rating.',
          timestamp: new Date(Date.now() - 4 * 3600 * 1000),
        },
      ],
    });

    const c4 = await Complaint.create({
      ticketId: 'CMP-2026-1004',
      title: 'Central Dining Hall Drinking Water Filter & Hygiene Inspection Needed',
      description:
        'The reverse-osmosis drinking water unit on the second floor of Central Mess is showing elevated turbidity and lukewarm temperature. Routine filter replacement needed.',
      category: 'Mess & Canteen',
      priority: 'High',
      status: 'In Progress',
      location: 'Central Dining Hall, Counter 2',
      isAnonymous: false,
      publicToCampus: true,
      upvotes: [abdul._id, karan._id],
      complainant: karan._id,
      assignedTo: sahil._id,
      assignedDepartment: 'Maintenance & Infrastructure',
      activityLog: [
        {
          action: 'Complaint Registered',
          performedBy: karan._id,
          performerName: karan.name,
          note: 'Turbidity in RO dispenser reported.',
          timestamp: new Date(Date.now() - 20 * 3600 * 1000),
        },
        {
          action: 'Status changed to In Progress',
          performedBy: sahil._id,
          performerName: sahil.name,
          note: 'Commercial filter cartridges being replaced today.',
          timestamp: new Date(Date.now() - 7 * 3600 * 1000),
        },
      ],
      comments: [
        {
          user: sahil._id,
          message:
            'Water testing sample collected this morning. Replacement carbon block and sediment filter cartridges arriving today.',
          isStaffOnly: false,
          createdAt: new Date(Date.now() - 5 * 3600 * 1000),
        },
      ],
    });

    const c5 = await Complaint.create({
      ticketId: 'CMP-2026-1005',
      title: 'Dim Path Lighting Along North Campus Walkway at Night',
      description:
        'Three consecutive high-mast streetlights between the Library and North Gate are completely non-functional, creating pitch-dark zones after 8 PM.',
      category: 'Safety & Security',
      priority: 'Urgent',
      status: 'Pending',
      location: 'North Campus Walkway near Gate 3',
      isAnonymous: false,
      publicToCampus: true,
      upvotes: [abdul._id, karan._id],
      complainant: abdul._id,
      assignedDepartment: 'Maintenance & Infrastructure',
      activityLog: [
        {
          action: 'Complaint Registered',
          performedBy: abdul._id,
          performerName: abdul.name,
          note: 'Night walkway safety hazard reported.',
          timestamp: new Date(Date.now() - 2 * 3600 * 1000),
        },
      ],
    });

    // 3. Create Notifications
    await Notification.create([
      {
        recipient: abdul._id,
        title: 'Status Update: In Progress',
        message: 'Your complaint CMP-2026-1001 (Hostel Room A-204 AC) is being worked on by Sahil.',
        type: 'STATUS_CHANGE',
        complaint: c1._id,
        read: false,
      },
      {
        recipient: abdul._id,
        title: 'New Comment from Resolver Sahil',
        message: 'Sahil: "Hello Abdul, I have isolated the MCB circuit for room 204..."',
        type: 'COMMENT',
        complaint: c1._id,
        read: false,
      },
      {
        recipient: sahil._id,
        title: 'Urgent Ticket Assigned',
        message: 'You have been assigned to urgent complaint CMP-2026-1001 by Admin Sohaib.',
        type: 'ASSIGNMENT',
        complaint: c1._id,
        read: false,
      },
      {
        recipient: karan._id,
        title: 'Issue Resolved: CMP-2026-1003',
        message: 'Mechanical Workshop 3D Printer has been resolved by Sahil.',
        type: 'STATUS_CHANGE',
        complaint: c3._id,
        read: true,
      },
      {
        recipient: sohaib._id,
        title: 'Urgent Complaint Alert',
        message: 'CMP-2026-1005 (North Campus Walkway) requires administrative review.',
        type: 'SYSTEM',
        complaint: c5._id,
        read: false,
      },
    ]);

    console.log('🎉 Seeding to Local MongoDB completed successfully with 0 internet dependency!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
