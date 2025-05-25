import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from '../entities/comment.entity';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    findAll(): Promise<Comment[]> {
        return this.commentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Comment> {
        return this.commentService.findOne(+id);
    }

    @Post()
    create(@Body() comment: Comment): Promise<Comment> {
        return this.commentService.create(comment);
    }
    @Put(':id')
    update(@Param('id') id: string, @Body() comment: Partial<Comment>): Promise<void> {
        return this.commentService.update(+id, comment);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.commentService.remove(+id);
    }
    @Get('post/:postId')
    findByPostId(@Param('postId') postId: string): Promise<Comment[]> {
        return this.commentService.findByPostId(+postId);
    }
    @Get('user/:userId')
    findByUserId(@Param('userId') userId: string): Promise<Comment[]> {
        return this.commentService.findByUserId(+userId);
    }
    @Get('date-range')
    findByDateRange(@Body('startDate') startDate: string, @Body('endDate') endDate: string): Promise<Comment[]> {
        return this.commentService.findByDateRange(new Date(startDate), new Date(endDate));
    }
}