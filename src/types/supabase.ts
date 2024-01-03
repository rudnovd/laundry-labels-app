export type ItemTagGroup =
  | 'colors'
  | 'tops'
  | 'bottoms'
  | 'outwear'
  | 'footwear'
  | 'underwear-and-nightwear'
  | 'bedding'

export type ItemSymbolGroup =
  | 'washing'
  | 'ironing'
  | 'bleaching'
  | 'tumble-drying'
  | 'natural-drying'
  | 'dry-cleaning'
  | 'wet-cleaning'

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          created_at: string
          id: string
          materials: string[]
          name: string | null
          owner: string
          photos: string[]
          symbols: string[]
          tags: string[]
          updated_at: string | null
        }
        Insert: {
          materials?: string[]
          name?: string | null
          owner: string
          photos?: string[]
          symbols?: string[]
          tags?: string[]
        }
        Update: {
          materials?: string[]
          name?: string | null
          owner?: string
          photos?: string[]
          symbols?: string[]
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: 'items_owner_fkey'
            columns: ['owner']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      items_materials: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      items_symbols: {
        Row: {
          description: string
          group: string
          name: string
        }
        Insert: {
          description: string
          group: string
          name: string
        }
        Update: {
          description?: string
          group?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'items_symbols_group_fkey'
            columns: ['group']
            isOneToOne: false
            referencedRelation: 'items_symbols_groups'
            referencedColumns: ['group']
          },
        ]
      }
      items_symbols_groups: {
        Row: {
          description: string | null
          group: ItemSymbolGroup
        }
        Insert: {
          description?: string | null
          group: ItemSymbolGroup
        }
        Update: {
          description?: string | null
          group?: ItemSymbolGroup
        }
        Relationships: []
      }
      items_tags: {
        Row: {
          group: ItemTagGroup
          name: string
        }
        Insert: {
          group: ItemTagGroup
          name: string
        }
        Update: {
          group?: ItemTagGroup
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'items_tags_group_fkey'
            columns: ['group']
            isOneToOne: false
            referencedRelation: 'items_tags_groups'
            referencedColumns: ['group']
          },
        ]
      }
      items_tags_groups: {
        Row: {
          description: string | null
          group: string
        }
        Insert: {
          description?: string | null
          group: string
        }
        Update: {
          description?: string | null
          group?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views'])
    ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never

export type ExistingTables = keyof Database['public']['Tables']
export type EntityBase<T extends ExistingTables> = Database['public']['Tables'][T]
export type RowType<T extends ExistingTables> = EntityBase<T>['Row']
export type InsertType<T extends ExistingTables> = EntityBase<T>['Insert']
export type UpdateType<T extends ExistingTables> = EntityBase<T>['Update']
