export type VenueType =
  | 'restaurant'
  | 'cafe'
  | 'coffee_shop'
  | 'bar'
  | 'hookah_lounge'
  | 'fast_food'
  | 'canteen'
  | 'bakery'
  | 'food_court'

export type BuildingType =
  | 'residential_ground'
  | 'non_residential'
  | 'shopping_center'
  | 'standalone'
  | 'business_center'
  | 'street_retail'

export type FloorType = 'basement' | '1' | '2' | '3_plus' | 'shopping_center'

export type KitchenType =
  | 'hot_grill'
  | 'hot_no_open_fire'
  | 'cold_assembly'
  | 'bakery'
  | 'drinks_snacks'
  | 'no_kitchen'

export type PhaseType = 'single_220' | 'three_380' | 'unknown'
export type ExhaustChannel = 'dedicated' | 'shared_building' | 'none' | 'unknown'
export type ExhaustOutput = 'facade' | 'roof' | 'unknown' | 'none'
export type HotWater = 'central' | 'cold_boiler' | 'no_water' | 'unknown'
export type SeweragePoints = 'in_place' | 'wrong_place' | 'none' | 'unknown'
export type VentilationType = 'supply_exhaust' | 'exhaust_only' | 'supply_only' | 'none' | 'unknown'

export type NeighborsAbove = 'residential' | 'offices' | 'commercial' | 'attic' | 'roof'
export type NeighborsBelow = 'ground_floor' | 'basement' | 'other' | 'unknown'
export type EntranceGroup = 'separate_street' | 'shared' | 'shopping_center' | 'multiple'
export type DoorWidth = 'less_09' | '09_12' | 'more_12' | 'unknown'
export type BasementAccess = 'accessible' | 'inaccessible' | 'none' | 'unknown'
export type FloorStructure = 'monolith_rc' | 'precast_rc' | 'wooden' | 'unknown'
export type FacadeType = 'own' | 'shared_mall' | 'internal' | 'unknown'

export type CurrentCondition = 'shell_core' | 'after_tenant' | 'needs_capital_repair' | 'unknown'
export type PreviousUse = 'food_service' | 'retail' | 'office' | 'other' | 'unknown'
export type AirConditioning = 'yes' | 'no' | 'possible' | 'unknown'
export type InternetType = 'fiber' | 'adsl' | 'none' | 'unknown'
export type ParkingType = 'own' | 'street' | 'none' | 'unknown'
export type WheelchairAccess = 'yes' | 'partial' | 'no' | 'unknown'
export type LoadingZone = 'separate_entrance' | 'shared' | 'none' | 'unknown'

export type WorkingHours = 'until_22' | 'until_00' | 'until_02' | '24h'
export type AlcoholSales = 'yes' | 'no' | 'undecided'
export type TerraceOption = 'yes' | 'no' | 'considering'
export type LeaseTerm = 'less_1y' | '1_3y' | '3_5y' | 'more_5y' | 'unknown'
export type RenovationPayer = 'tenant' | 'landlord_partial' | 'rent_holiday' | 'unknown'

// Full form data
export interface AuditFormData {
  // Block 1: Basic params
  venueType: VenueType
  area: number
  floor: FloorType
  buildingType: BuildingType
  ceilingHeight: number
  kitchenType: KitchenType
  seatingCapacity: number

  // Block 2: Engineering
  electricalPower: number | null
  electricalPowerUnknown: boolean
  phaseType: PhaseType
  exhaustChannel: ExhaustChannel
  exhaustOutput: ExhaustOutput
  hotWater: HotWater
  seweragePoints: SeweragePoints
  hasGas: 'yes' | 'no' | 'unknown'
  ventilationType: VentilationType

  // Block 3: Construction
  neighborsAbove: NeighborsAbove
  neighborsBelow: NeighborsBelow
  entranceGroup: EntranceGroup
  doorWidth: DoorWidth
  basementAccess: BasementAccess
  floorStructure: FloorStructure
  facadeType: FacadeType

  // Block 4: Concept & Legal
  workingHours: WorkingHours
  alcoholSales: AlcoholSales
  terrace: TerraceOption
  leaseTerm: LeaseTerm
  renovationPayer: RenovationPayer
  freeDescription: string
  conceptNotes: string
  // floorPlan handled separately via upload

  // Block 5: Location & Condition
  address: string
  district: string
  currentCondition: CurrentCondition
  previousUse: PreviousUse

  // Block 6: Additional Engineering
  airConditioning: AirConditioning
  restroomCount: number
  internetType: InternetType

  // Block 7: Accessibility & Logistics
  parkingType: ParkingType
  parkingSpaces: number | null
  wheelchairAccess: WheelchairAccess
  loadingZone: LoadingZone
}

// Report types
export type Verdict = 'GO' | 'GO_WITH_RESERVATIONS' | 'NO_GO'
export type BlockStatus = 'OK' | 'WARNING' | 'CRITICAL'
export type Severity = 'info' | 'warning' | 'critical'

export interface Finding {
  description: string
  regulation: string
  severity: Severity
  recommendation: string
}

export interface AnalysisBlock {
  id: 'electrical' | 'ventilation' | 'water_sewage' | 'fire_safety' | 'sanitation' | 'planning'
  title: string
  status: BlockStatus
  findings: Finding[]
}

export interface BudgetItem {
  item: string
  min: number
  max: number
}

export interface RiskItem {
  rank: number
  description: string
  severity: 'high' | 'critical'
}

export interface AuditReport {
  verdict: Verdict
  score: number // 0-100 overall rating of the premises
  summary: string
  blocks: AnalysisBlock[]
  budget: {
    min: number
    max: number
    breakdown: BudgetItem[]
  }
  top_risks: RiskItem[]
  next_steps: string[]
  disclaimer: string
}

export type AuditStatus = 'PENDING' | 'PROCESSING_OCR' | 'PROCESSING_AI' | 'COMPLETED' | 'FAILED'
export type AuditTier = 'FREE' | 'STANDARD' | 'EXTENDED'
