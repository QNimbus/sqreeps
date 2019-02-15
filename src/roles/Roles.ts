import { Role } from './Role';
import { RoleHarvester } from './instances/RoleHarvester';
import { RoleUpgrader } from './instances/RoleUpgrader';

var RolesList: { [roleName: string]: any } = {
    harvester: RoleHarvester,
    upgrader: RoleUpgrader
}

export function roles(roleName: string): Role {
    return new RolesList[roleName];
}
