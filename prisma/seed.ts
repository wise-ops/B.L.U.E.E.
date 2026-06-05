// Seed script — creates starter data so you can log in and test immediately.
// Run with: npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BLUEE...");

  const hash = async (pw: string) => bcrypt.hash(pw, 10);

  // ── Super Admin (you / BLUEE HQ) ──────────────────────────────
  await prisma.user.upsert({
    where: { email: "superadmin@bluee.app" },
    update: {},
    create: {
      email: "superadmin@bluee.app",
      name: "BLUEE HQ",
      passwordHash: await hash("admin123!"),
      role: "SUPER_ADMIN",
    },
  });

  // ── A sample clinic (tenant) ──────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: "happy-paws" },
    update: {},
    create: {
      name: "Happy Paws Veterinary",
      slug: "happy-paws",
      primaryColor: "#4682b4",
      secondaryColor: "#556b2f",
      plan: "pro",
    },
  });

  // Job role for auto-assignment
  const csrRole = await prisma.jobRole.upsert({
    where: { organizationId_name: { organizationId: org.id, name: "CSR" } },
    update: {},
    create: { name: "CSR", organizationId: org.id },
  });

  // ── Clinic admin ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@happypaws.com" },
    update: {},
    create: {
      email: "admin@happypaws.com",
      name: "Dr. Sam Rivera",
      passwordHash: await hash("admin123!"),
      role: "ORG_ADMIN",
      organizationId: org.id,
    },
  });

  // ── An employee/learner ───────────────────────────────────────
  const employee = await prisma.user.upsert({
    where: { email: "alex@happypaws.com" },
    update: {},
    create: {
      email: "alex@happypaws.com",
      name: "Alex Morgan",
      passwordHash: await hash("employee123!"),
      role: "EMPLOYEE",
      organizationId: org.id,
      jobRoleId: csrRole.id,
    },
  });

  // ── A sample published course with real interactive content ───
  // Based on CSR onboarding material, written as original content.
  const course = await prisma.course.create({
    data: {
      title: "CSR Foundations: The Front Desk Role",
      description:
        "An onboarding course for Client Service Representatives covering their role on the care team, professional communication, and confidentiality.",
      category: "CSR",
      status: "PUBLISHED",
      modules: {
        create: [
          {
            title: "Module 1 — Your Role on the Care Team",
            order: 0,
            lessons: {
              create: [
                {
                  title: "The CSR as Part of the Care Team",
                  order: 0,
                  blocks: [
                    {
                      type: "text",
                      content:
                        "Client Service Representatives are an essential part of the veterinary care team. As the first point of contact between clients and the medical staff, CSRs keep information accurate, organized, and moving smoothly. Their work directly affects patient care: well-prepared appointments, complete records, and clear communication all start at the front desk.",
                    },
                    {
                      type: "callout",
                      variant: "tip",
                      content:
                        "You are not 'just the front desk.' You are the connection point that keeps the whole clinic running. The medical team depends on the accuracy of what you capture.",
                    },
                    {
                      type: "quiz",
                      question:
                        "A client calls asking about their pet's recent lab results. What is the CSR's best first step?",
                      options: [
                        {
                          text: "Read the results over the phone to save the vet time",
                          isCorrect: false,
                          feedback:
                            "Interpreting medical results is outside the CSR scope and could cause confusion or harm.",
                        },
                        {
                          text: "Take a clear message and route it to the medical team per clinic protocol",
                          isCorrect: true,
                          feedback:
                            "Exactly. Capture the request accurately and hand it to the right person.",
                        },
                        {
                          text: "Tell the client to call back later",
                          isCorrect: false,
                          feedback:
                            "This frustrates clients and drops the ball on follow-through.",
                        },
                      ],
                    },
                  ],
                },
                {
                  title: "Professional Communication & Confidentiality",
                  order: 1,
                  blocks: [
                    {
                      type: "text",
                      content:
                        "CSRs communicate clearly, respectfully, and professionally with clients and team members at all times — using calm, courteous language, active listening, and accurate information without speculation. Part of professionalism is knowing when to answer and when to escalate to the medical team.\n\nCSRs are also entrusted with sensitive client and patient information. Records, client details, and conversations stay confidential and are shared only with authorized people for patient care.",
                    },
                    {
                      type: "scenario",
                      prompt:
                        "A caller says they're the neighbor of a patient's owner and asks how the pet's surgery went. What do you do?",
                      options: [
                        {
                          text: "Share a quick update since they clearly care",
                          isCorrect: false,
                          feedback:
                            "Patient information can only be shared with the owner, not neighbors or third parties.",
                        },
                        {
                          text: "Kindly explain you can't share patient information with anyone but the owner",
                          isCorrect: true,
                          feedback:
                            "Right. Acknowledge their concern warmly, but protect confidentiality.",
                        },
                      ],
                    },
                    {
                      type: "flashcard",
                      front: "When should a CSR escalate a clinical question?",
                      back: "Any time it requires medical interpretation or judgment — route it to a technician or veterinarian rather than answering yourself.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Assign the course to the employee
  await prisma.courseAssignment.upsert({
    where: { userId_courseId: { userId: employee.id, courseId: course.id } },
    update: {},
    create: {
      courseId: course.id,
      userId: employee.id,
      organizationId: org.id,
      assignedById: admin.id,
      status: "ASSIGNED",
    },
  });

  console.log("\n✅ Seed complete! Test accounts:");
  console.log("  Super Admin: superadmin@bluee.app / admin123!");
  console.log("  Clinic Admin: admin@happypaws.com / admin123!");
  console.log("  Employee:    alex@happypaws.com / employee123!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
