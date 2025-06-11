import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class  AddOrderIdToOrdersProducts1749497599897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'orders_products',
            new TableColumn({
                name: 'order_id',
                type: 'integer',
                isNullable: true,
            })
        )

        await queryRunner.createForeignKey(
            'orders_products',
            new TableForeignKey({
                name: 'OrdersProductsOrders',
                columnNames: ['order_id'],
                referencedTableName: 'orders',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('order_products', 'OrdersProductsOrders')
        await queryRunner.dropColumn('orders_products', 'order_id') 
    }

}
