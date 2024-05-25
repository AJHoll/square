
import { Reflector } from '@nestjs/core';

export const HasRoles = Reflector.createDecorator<string[]>();