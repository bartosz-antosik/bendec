/** GENERATED BY BENDEC TYPE GENERATOR */
  export type u8 = number
  export type u16 = number
  
  export enum AnimalKind {
    Zebra = 0x1001,
    Toucan = 0x1002,
  }
  
  export interface Zebra {
    kind: AnimalKind
    legs: u8
  }
  
  export interface Toucan {
    kind: AnimalKind
    wingspan: u16
  }
  
  export type Animal = Zebra | Toucan

  export enum AnimalKind2 {
    Zebra2 = 0x0001,
    Toucan2 = 0x0002,
  }

  export interface Header {
    animalKind: AnimalKind2
  }
  
  export interface Zebra2 {
    header: Header
    legs: u8
  }
  
  export interface Toucan2 {
    header: Header
    wingspan: u16
  }
  
  export type Animal2 = Zebra2 | Toucan2

  export enum Bitflags {
    A = 0x0001,
    B = 0x0002,
    Long = 0x0004,
  }

