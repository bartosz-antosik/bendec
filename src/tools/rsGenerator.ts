/**
 * Rust code generator
 */

import * as fs from 'fs'
import { range, snakeCase } from 'lodash'
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import { Kind, StructStrict, EnumStrict, UnionStrict } from '../types'

type TypeMapping = { [k: string]: (size: number) => string }

type Options = {
  typeMapping?: TypeMapping
  attribute?: string
}

export const defaultOptions = {
  attribute: '',
}

export const defaultMapping: TypeMapping = {
  'char[]': size => `[u8; ${size}]`,
}

const indent = (i: number) => (str: string) => {
  return '                    '.substr(-i) + str
}

const getMembers = (fields: Field[], typeMap: TypeMapping) => {
  return fields.map(field => {
    const key = field.type + (field.length ? '[]' : '')
    const rustType = field.length ? `[${field.type}; ${field.length}]` : field.type
    const theType = (typeMap[key] !== undefined)
      ? typeMap[key](field.length)
      : rustType

    const theField =  `  pub ${snakeCase(field.name)}: ${theType},`

    if (field.length > 32) {
      return '  #[serde(with = "BigArray")]\n' + theField
    }
    return theField
  })
}

const getEnum = (
  { name, underlying, variants }: EnumStrict,
  attribute: string
) => {
  const variantsFields = variants.map(([key, value]) => `  ${key} = ${value},`).join('\n')
  return `${attribute}
#[repr(${underlying})]
#[derive(Serialize_repr, Deserialize_repr)]
pub enum ${name} {
${variantsFields}
}`
}

const getUnion = (
  { name, discriminator, members }: UnionStrict,
  discTypeDef: TypeDefinitionStrict,
  attribute: string
) => {
  
  const unionMembers = members.map(member => {
    return `  pub ${snakeCase(member)}: ${member},`
  }).join('\n')

  const union = `${attribute}
#[repr(C, packed)]
pub union ${name} {
${unionMembers}
}`

  const serdeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => self.${snakeCase(member)}.serialize(serializer),`
  }).map(indent(8)).join('\n')

  const discPath = discriminator.map(snakeCase).join('.')
  // we need to generate serde for union as it can't be derived
  const unionSerde = `impl Serialize for ${name} {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where S: Serializer,
  {
    unsafe {
      match &self.${snakeCase(members[0])}.${discPath} {
${serdeMembers} 
      }
    }
  }
}`

  return [union, unionSerde].join('\n\n')
}

/**
 * Generate TypeScript interfaces from Bendec types definitions
 */
export const generateString = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) => {

  const ignoredTypes = ['char']

  const types: TypeDefinitionStrict[] = normalizeTypes(typesDuck)
  const { typeMapping } = { ...defaultOptions, ...options }
  const typeMap: TypeMapping = { ...defaultMapping, ...typeMapping }

  const definitions = types.map(typeDef => {
    const typeName = typeDef.name

    if (typeMap[typeName]) {
      return `pub type ${typeName} = ${typeMap[typeName]}`
    }

    if (ignoredTypes.includes(typeName)) {
      return `// ignored: ${typeName}`
    }

    if (typeDef.kind === Kind.Primitive) {
      return `// primitive built-in: ${typeName}`
    }

    if (typeDef.kind === Kind.Alias) {
      return `pub type ${typeName} = ${typeDef.alias};`
    }

    if (typeDef.kind === Kind.Union) {
      // determine the type of the discriminator from one of union members
      // TODO: validate if all members have discriminator
      const memberName = typeDef.members[0]
      const memberType = <StructStrict>types.find(({ name }) => name === memberName)

      const discTypeDef = typeDef.discriminator.reduce((currentTypeDef, pathSection) => {
        
        if (currentTypeDef.kind !== Kind.Struct) {
          throw new Error(`The path to union discriminator can only contain Structs, ${currentTypeDef.name} is not a Struct`)
        }

        const discTypeField = (<StructStrict>currentTypeDef).fields.find(({ name }) => name === pathSection)
        if (discTypeField === undefined) {
          throw new Error(`no field '${pathSection}' in struct '${currentTypeDef.name}'`)
        }
        return <StructStrict>types.find(({ name }) => name === discTypeField.type)
      }, memberType as TypeDefinitionStrict)

      return getUnion(typeDef, discTypeDef, options.attribute)
    }

    if (typeDef.kind === Kind.Enum) {
      return getEnum(typeDef, options.attribute)
    }

    if (typeDef.kind === Kind.Struct) {
      const members = typeDef.fields
        ? getMembers(typeDef.fields, typeMap)
        : []

      const membersString = members.join('\n')

      return `${options.attribute}
#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
pub struct ${typeName} {
${membersString}
}`
    }
  })

  const result = definitions.join('\n\n')
  return `/** GENERATED BY BENDEC TYPE GENERATOR */
use serde::{Serializer, Serialize, Deserialize};
use serde_repr::{Serialize_repr, Deserialize_repr};
big_array! { BigArray; }
  ${result}
`
}

/**
 * Generate Rust types from Bendec types definitions
 */
export const generate = (types: any[], fileName: string, options?: Options) => {
  const moduleWrapped = generateString(types, options)

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
