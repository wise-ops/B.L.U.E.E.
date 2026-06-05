import { prisma } from "@/lib/prisma";

export default async function Organizations() {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Clinics</h1>
      <p className="text-gray-500 mb-6">Every veterinary clinic on the platform.</p>
      {orgs.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          No clinics yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map((o: any) => (
            <div key={o.id} className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-bluee-navy">{o.name}</h3>
                <p className="text-sm text-gray-500">
                  {o._count.users} staff · {o.plan} plan
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${o.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {o.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
