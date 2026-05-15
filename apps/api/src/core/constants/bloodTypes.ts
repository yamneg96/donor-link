export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum ComponentType {
  WHOLE_BLOOD = 'WHOLE_BLOOD',
  PACKED_RED_CELLS = 'PACKED_RED_CELLS',
  PLATELETS = 'PLATELETS',
  FRESH_FROZEN_PLASMA = 'FRESH_FROZEN_PLASMA',
  CRYOPRECIPITATE = 'CRYOPRECIPITATE',
}

/** Shelf life in days per component type */
export const COMPONENT_SHELF_LIFE: Record<ComponentType, number> = {
  [ComponentType.WHOLE_BLOOD]: 35,
  [ComponentType.PACKED_RED_CELLS]: 42,
  [ComponentType.PLATELETS]: 5,
  [ComponentType.FRESH_FROZEN_PLASMA]: 365,
  [ComponentType.CRYOPRECIPITATE]: 365,
};

/** Blood type compatibility matrix (recipient → compatible donors) */
export const BLOOD_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  [BloodType.AB_POSITIVE]: [BloodType.A_POSITIVE, BloodType.A_NEGATIVE, BloodType.B_POSITIVE, BloodType.B_NEGATIVE, BloodType.AB_POSITIVE, BloodType.AB_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType.AB_NEGATIVE]: [BloodType.A_NEGATIVE, BloodType.B_NEGATIVE, BloodType.AB_NEGATIVE, BloodType.O_NEGATIVE],
  [BloodType.A_POSITIVE]: [BloodType.A_POSITIVE, BloodType.A_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType.A_NEGATIVE]: [BloodType.A_NEGATIVE, BloodType.O_NEGATIVE],
  [BloodType.B_POSITIVE]: [BloodType.B_POSITIVE, BloodType.B_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType.B_NEGATIVE]: [BloodType.B_NEGATIVE, BloodType.O_NEGATIVE],
  [BloodType.O_POSITIVE]: [BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType.O_NEGATIVE]: [BloodType.O_NEGATIVE],
};

export const ALL_BLOOD_TYPES = Object.values(BloodType);
export const ALL_COMPONENT_TYPES = Object.values(ComponentType);
