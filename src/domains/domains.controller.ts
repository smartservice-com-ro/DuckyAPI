import { Controller, Delete, Get, Param, Post, Request, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags
} from "@nestjs/swagger"

import { Domain } from "./domain.class"
import { DomainParams } from "./domain.params"
import { DomainsService } from "./domains.service"

@Controller("domains")
@ApiUseTags("Domains")
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Invalid or expired token" })
@ApiBadRequestResponse({ description: "Error that is resolvable user side" })
@ApiInternalServerErrorResponse({ description: "Server error that is not resolvable user side" })
export class DomainsController {
  public constructor(private readonly domainsService: DomainsService) {}
  @Delete(":domain")
  @ApiOperation({
    title: "Remove domain",
    description: "WARNING: This will also remove any email accounts associated with this domain"
  })
  @ApiOkResponse({ description: "Domain successfully removed" })
  private async deleteDomain(@Request() req, @Param() domainParams: DomainParams): Promise<void> {
    await this.domainsService.deleteDomain(req.user, domainParams.domain)
  }

  @Get()
  @ApiOperation({ title: "List domains" })
  @ApiOkResponse({ description: "A list of domains", type: Domain, isArray: true })
  @ApiNotFoundResponse({ description: "No domains found" })
  private async getDomains(@Request() req): Promise<Domain[]> {
    return this.domainsService.getDomains(req.user)
  }

  @Post(":domain")
  @ApiOperation({ title: "Add domain" })
  @ApiCreatedResponse({ description: "Domain successfully added" })
  private async addDomain(@Request() req, @Param() domainParams: DomainParams): Promise<void> {
    await this.domainsService.addDomain(req.user, domainParams.domain)
  }
}