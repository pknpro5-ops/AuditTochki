import { z } from 'zod'

// Block 1: Basic params (all required)
export const step1Schema = z.object({
  venueType: z.enum([
    'restaurant', 'cafe', 'coffee_shop', 'bar', 'hookah_lounge',
    'fast_food', 'canteen', 'bakery', 'food_court'
  ], { message: 'Выберите тип заведения' }),
  area: z.number({ error: 'Укажите площадь' })
    .min(10, 'Минимум 10 м²')
    .max(5000, 'Максимум 5000 м²'),
  floor: z.enum(['basement', '1', '2', '3_plus', 'shopping_center'], {
    message: 'Выберите этаж'
  }),
  buildingType: z.enum([
    'residential_ground', 'non_residential', 'shopping_center',
    'standalone', 'business_center', 'street_retail'
  ], { message: 'Выберите тип здания' }),
  ceilingHeight: z.number({ error: 'Укажите высоту потолков' })
    .min(2.0, 'Минимум 2.0 м')
    .max(12.0, 'Максимум 12.0 м'),
  kitchenType: z.enum([
    'hot_grill', 'hot_no_open_fire', 'cold_assembly',
    'bakery', 'drinks_snacks', 'no_kitchen'
  ], { message: 'Выберите тип кухни' }),
  seatingCapacity: z.number({ error: 'Укажите количество мест' })
    .min(0, 'Минимум 0')
    .max(1000, 'Максимум 1000'),
})

// Block 2: Engineering (optional fields)
export const step2Schema = z.object({
  electricalPower: z.number().min(0).max(1000).nullable().default(null),
  electricalPowerUnknown: z.boolean().default(false),
  phaseType: z.enum(['single_220', 'three_380', 'unknown']).default('unknown'),
  exhaustChannel: z.enum(['dedicated', 'shared_building', 'none', 'unknown']).default('unknown'),
  exhaustOutput: z.enum(['facade', 'roof', 'unknown', 'none']).default('unknown'),
  hotWater: z.enum(['central', 'cold_boiler', 'no_water', 'unknown']).default('unknown'),
  seweragePoints: z.enum(['in_place', 'wrong_place', 'none', 'unknown']).default('unknown'),
  hasGas: z.enum(['yes', 'no', 'unknown']).default('unknown'),
  ventilationType: z.enum(['supply_exhaust', 'exhaust_only', 'supply_only', 'none', 'unknown']).default('unknown'),
})

// Block 3: Construction
export const step3Schema = z.object({
  neighborsAbove: z.enum(['residential', 'offices', 'commercial', 'attic', 'roof']).default('residential'),
  neighborsBelow: z.enum(['ground_floor', 'basement', 'other', 'unknown']).default('unknown'),
  entranceGroup: z.enum(['separate_street', 'shared', 'shopping_center', 'multiple']).default('separate_street'),
  doorWidth: z.enum(['less_09', '09_12', 'more_12', 'unknown']).default('unknown'),
  basementAccess: z.enum(['accessible', 'inaccessible', 'none', 'unknown']).default('unknown'),
  floorStructure: z.enum(['monolith_rc', 'precast_rc', 'wooden', 'unknown']).default('unknown'),
  facadeType: z.enum(['own', 'shared_mall', 'internal', 'unknown']).default('unknown'),
})

// Block 4: Concept & Legal
export const step4Schema = z.object({
  workingHours: z.enum(['until_22', 'until_00', 'until_02', '24h']).default('until_22'),
  alcoholSales: z.enum(['yes', 'no', 'undecided']).default('undecided'),
  terrace: z.enum(['yes', 'no', 'considering']).default('no'),
  leaseTerm: z.enum(['less_1y', '1_3y', '3_5y', 'more_5y', 'unknown']).default('unknown'),
  renovationPayer: z.enum(['tenant', 'landlord_partial', 'rent_holiday', 'unknown']).default('unknown'),
  freeDescription: z.string().max(2000).default(''),
  conceptNotes: z.string().max(1000).default(''),
})

// Block 5: Location & Condition
export const step5Schema = z.object({
  address: z.string().max(500).default(''),
  district: z.string().max(200).default(''),
  currentCondition: z.enum(['shell_core', 'after_tenant', 'needs_capital_repair', 'unknown']).default('unknown'),
  previousUse: z.enum(['food_service', 'retail', 'office', 'other', 'unknown']).default('unknown'),
})

// Block 6: Additional Engineering
export const step6Schema = z.object({
  airConditioning: z.enum(['yes', 'no', 'possible', 'unknown']).default('unknown'),
  restroomCount: z.number().min(0).max(10).default(0),
  internetType: z.enum(['fiber', 'adsl', 'none', 'unknown']).default('unknown'),
})

// Block 7: Accessibility & Logistics
export const step7Schema = z.object({
  parkingType: z.enum(['own', 'street', 'none', 'unknown']).default('unknown'),
  parkingSpaces: z.number().min(0).max(500).nullable().default(null),
  wheelchairAccess: z.enum(['yes', 'partial', 'no', 'unknown']).default('unknown'),
  loadingZone: z.enum(['separate_entrance', 'shared', 'none', 'unknown']).default('unknown'),
})

// Full schema
export const auditFormSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema).merge(step5Schema).merge(step6Schema).merge(step7Schema)

export type AuditFormValues = z.infer<typeof auditFormSchema>

// Labels for display
export const venueTypeLabels: Record<string, string> = {
  restaurant: 'Ресторан',
  cafe: 'Кафе',
  coffee_shop: 'Кофейня',
  bar: 'Бар',
  hookah_lounge: 'Кальянная',
  fast_food: 'Фастфуд',
  canteen: 'Столовая',
  bakery: 'Пекарня',
  food_court: 'Фудкорт',
}

export const buildingTypeLabels: Record<string, string> = {
  residential_ground: 'Жилой дом (1 эт.)',
  non_residential: 'Нежилое здание',
  shopping_center: 'Торговый центр',
  standalone: 'Отдельностоящее',
  business_center: 'Бизнес-центр',
  street_retail: 'Стрит-ритейл',
}

export const floorLabels: Record<string, string> = {
  basement: 'Подвал',
  '1': '1-й этаж',
  '2': '2-й этаж',
  '3_plus': '3-й и выше',
  shopping_center: 'В ТЦ (встроенная)',
}

export const kitchenTypeLabels: Record<string, string> = {
  hot_grill: 'Горячая (жарка, гриль, фритюр)',
  hot_no_open_fire: 'Горячая без открытого огня',
  cold_assembly: 'Холодная сборка и разогрев',
  bakery: 'Выпечка',
  drinks_snacks: 'Только напитки и снеки',
  no_kitchen: 'Без кухни',
}

export const phaseTypeLabels: Record<string, string> = {
  single_220: 'Однофазная 220В',
  three_380: 'Трёхфазная 380В',
  unknown: 'Неизвестно',
}

export const exhaustChannelLabels: Record<string, string> = {
  dedicated: 'Да, отдельный',
  shared_building: 'Только общедомовой',
  none: 'Нет',
  unknown: 'Неизвестно',
}

export const exhaustOutputLabels: Record<string, string> = {
  facade: 'Через фасад',
  roof: 'Через крышу',
  unknown: 'Неизвестно',
  none: 'Нет возможности',
}

export const hotWaterLabels: Record<string, string> = {
  central: 'Централизованное ГВС',
  cold_boiler: 'Только холодная + бойлер',
  no_water: 'Нет воды',
  unknown: 'Неизвестно',
}

export const sewerageLabels: Record<string, string> = {
  in_place: 'Есть в нужных местах',
  wrong_place: 'Есть, но не там',
  none: 'Нет',
  unknown: 'Неизвестно',
}

export const ventilationLabels: Record<string, string> = {
  supply_exhaust: 'Приточно-вытяжная есть',
  exhaust_only: 'Только вытяжная',
  supply_only: 'Только приточная',
  none: 'Нет',
  unknown: 'Неизвестно',
}

export const neighborsAboveLabels: Record<string, string> = {
  residential: 'Жилые квартиры',
  offices: 'Офисы',
  commercial: 'Другое коммерческое',
  attic: 'Чердак',
  roof: 'Последний этаж (крыша)',
}

export const neighborsBelowLabels: Record<string, string> = {
  ground_floor: 'Первый этаж (подвала нет)',
  basement: 'Подвал',
  other: 'Другие помещения',
  unknown: 'Неизвестно',
}

export const entranceGroupLabels: Record<string, string> = {
  separate_street: 'Отдельный вход с улицы',
  shared: 'Вход через общее помещение',
  shopping_center: 'Вход через ТЦ',
  multiple: 'Несколько входов',
}

export const doorWidthLabels: Record<string, string> = {
  less_09: 'Менее 0.9 м',
  '09_12': '0.9–1.2 м',
  more_12: 'Более 1.2 м',
  unknown: 'Неизвестно',
}

export const basementAccessLabels: Record<string, string> = {
  accessible: 'Да, доступен',
  inaccessible: 'Да, недоступен',
  none: 'Нет',
  unknown: 'Неизвестно',
}

export const floorStructureLabels: Record<string, string> = {
  monolith_rc: 'Монолитный ж/б',
  precast_rc: 'Сборный ж/б',
  wooden: 'Деревянные',
  unknown: 'Неизвестно',
}

export const facadeTypeLabels: Record<string, string> = {
  own: 'Своя часть фасада',
  shared_mall: 'Общий фасад ТЦ',
  internal: 'Внутренняя часть здания',
  unknown: 'Неизвестно',
}

export const workingHoursLabels: Record<string, string> = {
  until_22: 'До 22:00',
  until_00: 'До 00:00',
  until_02: 'До 02:00',
  '24h': 'Круглосуточно',
}

export const alcoholLabels: Record<string, string> = {
  yes: 'Да',
  no: 'Нет',
  undecided: 'Пока не решено',
}

export const terraceLabels: Record<string, string> = {
  yes: 'Да',
  no: 'Нет',
  considering: 'Рассматриваем',
}

export const leaseTermLabels: Record<string, string> = {
  less_1y: 'До 1 года',
  '1_3y': '1–3 года',
  '3_5y': '3–5 лет',
  more_5y: 'Более 5 лет',
  unknown: 'Неизвестно',
}

export const renovationPayerLabels: Record<string, string> = {
  tenant: 'Арендатор полностью',
  landlord_partial: 'Арендодатель частично',
  rent_holiday: 'Арендные каникулы',
  unknown: 'Неизвестно',
}

export const currentConditionLabels: Record<string, string> = {
  shell_core: 'Shell & Core (голые стены)',
  after_tenant: 'После предыдущего арендатора',
  needs_capital_repair: 'Требует капитального ремонта',
  unknown: 'Неизвестно',
}

export const previousUseLabels: Record<string, string> = {
  food_service: 'Общепит',
  retail: 'Магазин / ритейл',
  office: 'Офис',
  other: 'Другое',
  unknown: 'Неизвестно',
}

export const airConditioningLabels: Record<string, string> = {
  yes: 'Есть',
  no: 'Нет',
  possible: 'Возможна установка',
  unknown: 'Неизвестно',
}

export const internetTypeLabels: Record<string, string> = {
  fiber: 'Оптоволокно',
  adsl: 'ADSL / медь',
  none: 'Нет',
  unknown: 'Неизвестно',
}

export const parkingTypeLabels: Record<string, string> = {
  own: 'Собственная парковка',
  street: 'Уличная парковка',
  none: 'Нет парковки',
  unknown: 'Неизвестно',
}

export const wheelchairAccessLabels: Record<string, string> = {
  yes: 'Да, полный доступ',
  partial: 'Частичный (нужна доработка)',
  no: 'Нет',
  unknown: 'Неизвестно',
}

export const loadingZoneLabels: Record<string, string> = {
  separate_entrance: 'Отдельный вход для разгрузки',
  shared: 'Общий с основным входом',
  none: 'Нет',
  unknown: 'Неизвестно',
}
