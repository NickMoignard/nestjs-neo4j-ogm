import { QueryResult } from 'neo4j-driver';
import { NODE_VAR, RELATIONSHIP_VAR } from '.';

export function parseDeleteResult(result: QueryResult): boolean {
  if (result.records.length < 1) return;
  const nodesDeleted = result.records.length;
  return !!nodesDeleted;
}

function _parseManyResults(result: QueryResult, varName: string) {
  const rows = [];
  result.records.forEach((record) => {
    const row = { ...record.get(varName).properties };
    if (row.created) {
      row.created = row.created.toString();
    }
    if (row.updated) {
      row.updated = row.updated.toString();
    }
    rows.push(row);
  });
  return rows;
}
export function parseManyNodesResult(result: QueryResult) {
  if (result.records.length < 1) return;
  return _parseManyResults(result, NODE_VAR);
}
export function parseManyRelsResult(result: QueryResult) {
  if (result.records.length < 1) return;
  return _parseManyResults(result, RELATIONSHIP_VAR);
}

function _parseOneResult(result: QueryResult, varName: string) {
  const props = result.records[0].get(varName).properties;

  if (props.created) {
    props.created = props.created.toString();
  }
  if (props.updated) {
    props.updated = props.updated.toString();
  }

  return props;
}
export function parseOneNodeResult(result: QueryResult) {
  if (result.records.length < 1) return;
  return _parseOneResult(result, NODE_VAR);
}
export function parseOneRelResult(result: QueryResult) {
  if (result.records.length < 1) return;
  return _parseOneResult(result, RELATIONSHIP_VAR);
}
