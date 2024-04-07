export type Expense = {
	id: string,
    name: string,
    amount: string,
    description: string,
    categories: (keyof typeof CATEGORIES)[],
    people: string[],
}

export const CATEGORIES = {
    "DECOR": { name: "Decoracion", style: "bg-red-200 dark:bg-red-400 text-black"},
    "INFRA": { name: "Infraestructura", style: "bg-purple-200 dark:bg-purple-400 text-black" },
    "FOOD": { name: "Comida", style: "bg-green-200 dark:bg-green-400 text-black" },
    "TOOLS": { name: "Herramientas", style: "bg-blue-200 dark:bg-blue-400 text-black" },
    "ONLINE": { name: "Online", style: "bg-teal-200 dark:bg-teal-400 text-black" },
    "TRAVEL": { name: "Viajes", style: "bg-yellow-200 dark:bg-yellow-400 text-black" },
} as const;// as { [key: string]: { name: string, style: string } }

export const SUPPLIERS = [
    { name: "YPF", categories: ["TRAVEL",], cuit: "20-52374962-4", cbu: "1850583140090418117743", id: "2ed1265a-ade2-4f88-83c1-ac25212788d1" },
    { name: "Axion", categories: ["TRAVEL",], cuit: "20-23374962-4", cbu: "1850583140090418117743", id: "9e02f935-e9b3-46a5-9e87-bfbdd2424ef2" },
    { name: "Ferreteria tuerca", categories: ["TOOLS", "INFRA", ], cuit: "20-46834966-8", cbu: "2850590940098769123902", id: "74157105-a371-4a64-ad81-2d29917bfac5" },
    { name: "Kisco Delask", categories: ["DECOR",], cuit: "25-23434966-4", cbu: "2123592343290418135201", id: "fdee7659-cc7f-49cb-b02a-0f5b5c6af894" },
    { name: "Hipermercado", categories: ["FOOD",], cuit: "23-46234636-2", cbu: "0123590940090418135201", id: "5ce840a9-3f64-4c20-9ab6-d479cb61d152" },
    { name: "Adobe", categories: ["ONLINE",], cuit: "20-42334966-4", cbu: "2850590940090418112344", id: "a56a3dff-06f8-40f6-a60e-ca93c9a0d8d9" },
];

export const EXPENSES = [
    {
      id: "bb5a5768-5d91-4c6c-8014-aa44a56be733",
      name: "Repuestos",
      amount: "55000,00",

      description: "Comprar repuestos para la ferreteria",
      categories: ["DECOR", "INFRA", "TRAVEL", "ONLINE"],
      people: ["avatar-0", "avatar-0", "avatar-0", "avatar-0", "avatar-0", "avatar-1", "avatar-2"]
    },
    {
      id: "7b9f077f-6db2-449c-8068-6096c3ec4eff",
      name: "Viáticos Juan",
      amount: "16007,32",
      description: "Presupuesto para los viáticos de Juan",
      categories: ["TRAVEL"],
      people: ["avatar-1",]
    },
    {
      id: "197d50ff-f30c-4e11-b317-ed2cf0c76432",
      name: "Almuerzo para el equipo",
      amount: "234,99",
      description:
        "Almuerzo para el equipo de trabajo en el cumpleaños de la empresa",
      categories: ["FOOD", "ONLINE"],
      people: ["avatar-3", "avatar-1"]
    },
  ] as Expense[];

export const LINKS = [
  { name: "Presupuestos", href: '/expenses' },
  { name: "Provedores", href: '/suppliers', admin: true },
  { name: "Logout", href: '/' },
    // { name: "Home", href: '/' },
]