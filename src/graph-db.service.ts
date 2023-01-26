import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import * as Cypher from './query-tool';
import {
  CreateRelationshipInput,
  FindAllNodesInput,
  FindOneNodeInput,
  UpdateNodeInput,
  DeleteNodeInput,
  CreateNodeInput,
} from './query-tool';
import {
  parseDeleteResult,
  parseManyNodesResult,
  parseOneNodeResult,
  parseOneRelResult,
} from './query-tool/parse-results';

@Injectable()
export class GraphDbService {
  constructor(private readonly neo4j: Neo4jService) {}

  async createNode<T>(input: CreateNodeInput<T>) {
    const cypher = Cypher.createNode<T>(input);
    const res = await this.neo4j.write(cypher);
    return parseOneNodeResult(res);
  }

  async createRelationship<T>(input: CreateRelationshipInput<T>) {
    const cypher = Cypher.createRelationship<T>(input);
    const res = await this.neo4j.write(cypher);
    return parseOneRelResult(res);
  }
  async findAllNodes(input: FindAllNodesInput) {
    const cypher = Cypher.findAllNodes(input);
    const res = await this.neo4j.read(cypher);
    return parseManyNodesResult(res);
  }

  async findOneNode(input: FindOneNodeInput) {
    const cypher = Cypher.findOneNode(input);
    const res = await this.neo4j.read(cypher);
    return parseOneNodeResult(res);
  }

  async updateNode<T>(input: UpdateNodeInput<T>) {
    const cypher = Cypher.updateNode<T>(input);
    const res = await this.neo4j.write(cypher);
    return parseOneNodeResult(res);
  }

  async removeNode(input: DeleteNodeInput): Promise<boolean> {
    const cypher = Cypher.deleteNode(input);
    const res = await this.neo4j.write(cypher);
    return parseDeleteResult(res);
  }
}
