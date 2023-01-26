import { randomUUID } from 'crypto';
import { NODE_VAR, FROM_NODE_VAR, TO_NODE_VAR, RELATIONSHIP_VAR } from '.';
import {
  CreateNodeInput,
  CreateRelationshipInput,
  FindAllNodesInput,
  FindOneNodeInput,
  DeleteNodeInput,
  UpdateNodeInput,
} from './types';

export function createNode<T>({ label, dto }: CreateNodeInput<T>) {
  let cypher = `CREATE (${NODE_VAR}:${label} {id: '${randomUUID()}'})\n`;
  cypher = cypher + setProperties<T>(dto);
  cypher = cypher + `SET ${NODE_VAR}.created = datetime()\n`;
  cypher = cypher + `RETURN ${NODE_VAR}`;
  return cypher;
}

export function updateNode<T>({
  node: { id, label },
  dto,
}: UpdateNodeInput<T>) {
  let cypher = `MATCH (${NODE_VAR}:${label} {id: '${id}'})\n`;
  cypher = cypher + setProperties<T>(dto);
  cypher = cypher + `SET ${NODE_VAR}.updated = datetime()\n`;
  cypher = cypher + `RETURN ${NODE_VAR}`;
  return cypher;
}

export function createRelationship<T>({
  label,
  from,
  to,
  properties,
}: CreateRelationshipInput<T>) {
  const matchFrom = `MATCH (${FROM_NODE_VAR}:${from.label} {id: '${from.id}'})\n`;
  const matchTo = `MATCH (${TO_NODE_VAR}:${to.label} {id: '${to.id}'})\n`;
  const createRelationship = `CREATE (${FROM_NODE_VAR})-[${RELATIONSHIP_VAR}:${label}]->(${TO_NODE_VAR})\n`;

  let cypher = matchFrom + matchTo + createRelationship;

  cypher = cypher + setProperties<T>(properties, RELATIONSHIP_VAR);
  cypher = cypher + `SET ${RELATIONSHIP_VAR}.created = datetime()\n`;
  cypher = cypher + `RETURN ${RELATIONSHIP_VAR}`;
  return cypher;
}

export function deleteNode({ id, label }: DeleteNodeInput) {
  let cypher = `MATCH (${NODE_VAR}:${label} {id: '${id}'})\n`;
  cypher = cypher + `DETACH DELETE ${NODE_VAR}\n`;
  cypher = cypher + `RETURN ${NODE_VAR}`;
  return cypher;
}

export function findOneNode({ id, label }: FindOneNodeInput) {
  let cypher = `MATCH (${NODE_VAR}:${label} {id: '${id}'})\n`;
  cypher = cypher + `RETURN ${NODE_VAR}`;
  return cypher;
}

export function findAllNodes({ label, ...rest }: FindAllNodesInput) {
  let cypher = `MATCH (${NODE_VAR}:${label})\n`;
  cypher = cypher + `RETURN ${NODE_VAR}\n`;
  cypher = cypher + paginateQuery(rest);
  return cypher;
}

export function paginateQuery(input: {
  pagination: { page: number; perPage: number };
  order: { field: string; direction: string };
}) {
  const {
    pagination: { page, perPage },
    order: { field, direction },
  } = input;
  let cypher = `ORDER BY ${NODE_VAR}.${field} ${
    direction !== 'DESC' ? '' : direction
  }\n`;
  if (page !== 1) {
    cypher = cypher + `SKIP ${(page - 1) * perPage}\n`;
  }
  cypher = cypher + `LIMIT ${perPage}`;
  return cypher;
}

export function setProperties<T>(input: T, varName: string = NODE_VAR) {
  let partial = '';
  for (const k in input) {
    const v = input[k];
    partial = partial + `SET ${varName}.${k} = '${v}'\n`;
  }
  return partial;
}
