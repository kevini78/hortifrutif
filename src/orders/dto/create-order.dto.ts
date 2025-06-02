import { IsOptional, IsInt, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: "ID do endereço de entrega cadastrado pelo usuário" })
  addressId: number;

  // Add paymentMethod property
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "credit_card", description: "Método de pagamento escolhido (opcional no momento da criação)", required: false })
  paymentMethod?: string;

  // Note: Items are taken directly from the user's cart by the service, not passed in DTO.
}