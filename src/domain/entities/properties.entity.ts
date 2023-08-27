import { Column, Entity, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Properties {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'smallint' })
  bedrooms: number;

  @Column({ type: 'smallint' })
  bathrooms: number;

  @Column({ type: 'text', nullable: true })
  type: string | null;
}

export const PropertiesSchema = new EntitySchema<Properties>({
  name: 'Properties',
  target: Properties,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: true,
    },
    address: {
      type: String,
    },
    price: {
      type: Number,
    },

    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    type: {
      type: Number,
    },
  },
});
