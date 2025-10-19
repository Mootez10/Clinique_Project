import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user';
import { userRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get()
    getUsers(@Query('role') role?: userRole) {
        return this.usersService.getUsers(role);
    }
    @Get(':role/:id')
    findUserById(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('role', new ParseEnumPipe(userRole)) role: userRole) {
        return this.usersService.findUserById(id, role);
    }

    @Post('create-admin')
    createAdmin(@Body() userDto: CreateUserDto) {
        return this.usersService.createAdmin(userDto);
    }

    @Post('create-recep')
    createReceptionist(@Body() userDto: CreateUserDto) {
        return this.usersService.createReceptionist(userDto);
    }

    @Post('create-patient')
    createPatient(@Body() userDto: CreateUserDto) {
        return this.usersService.createPatient(userDto);
    }

    @Post('create-doctor')
    createDoctor(@Body() userDto: CreateUserDto) {
        return this.usersService.createDoctor(userDto);
    }

    @Delete(':role/:id')
    deleteUserById(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('role', new ParseEnumPipe(userRole)) role: userRole) {
        return this.usersService.deleteUserById(id, role);
    }


}
