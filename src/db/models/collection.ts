import { Model, ensureExtends, Column } from "../model";
import { JSONField } from "../json-field";
import { DateTimeField } from "../datetime-field";

const CollectionModelOriginal = {
  table: "collections",
  primaryKey: "id",
  columns: {
    id: Column.Integer,

    title: Column.Text,
    userId: Column.Integer,

    createdAt: Column.DateTime,
    updatedAt: Column.DateTime,

    gamesCount: Column.Integer,
    gameIds: Column.JSON,
  },
};

export const CollectionModel: Model = CollectionModelOriginal;

type Columns = { [K in keyof typeof CollectionModelOriginal.columns]: any };
ensureExtends<Columns, ICollection>();
ensureExtends<ICollection, Columns>();

export interface ICollection {
  /** the collection's site-wide identifier, generated by itch.io */
  id: number;

  /** the collection's title */
  title: string;

  /** the date the collection was first created at */
  createdAt: DateTimeField;

  /** the date the collection was last updated at (description, contents, etc.) */
  updatedAt: DateTimeField;

  /** the total number of games in that collection */
  gamesCount: number;

  /** the list of identifiers for games that belong to that collection */
  gameIds: JSONField<number[]>;

  /** the creator of this collection */
  userId: number;
}
