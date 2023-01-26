export type BaseNode = {
  id: string;
  label: string;
};

export type CreateNodeInput<T> = {
  label: string;
  dto: T;
};
export type FindAllNodesInput = {
  label: string;
  pagination: { page: number; perPage: number };
  order: { field: string; direction: string };
};
export type FindOneNodeInput = BaseNode;
export type UpdateNodeInput<T> = {
  node: BaseNode;
  dto: T;
};
export type DeleteNodeInput = BaseNode;
export type CreateRelationshipInput<T> = {
  label: string;
  from: BaseNode;
  to: BaseNode;
  properties: T;
};
