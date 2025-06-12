import { Controller, Post, Delete, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthGuard } from '../RoleBased/guards/auth.guard';
import { ReactionService } from './reacts.service';
import { Reaction } from './entities/react.entity';
import { Roles } from '../RoleBased/decorators/roles.decorators';
import { Role } from '../RoleBased/enum/roles.enum';
import { RoleGuard } from '../RoleBased/guards/role.guard';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addReaction(
    @Body() reactionData: { type: string; blogPostId?: number; projectId?: number },
    @Request() req,
  ): Promise<Reaction> {
    const user = req.user;
    return this.reactionService.addReaction(reactionData.type, user, reactionData.blogPostId, reactionData.projectId);
  }

  @Delete()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  async removeReaction(
    @Body() reactionData: { blogPostId?: number; projectId?: number },
    @Request() req,
  ): Promise<void> {
    const user = req.user;
    await this.reactionService.removeReaction(user, reactionData.blogPostId, reactionData.projectId);
  }

  @Get()
  async getReactions(
    @Query('blogPostId') blogPostId?: number,
    @Query('projectId') projectId?: number,
  ): Promise<Reaction[]> {
    return this.reactionService.getReactions(blogPostId, projectId);
  }
}