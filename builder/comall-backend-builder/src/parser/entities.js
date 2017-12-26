import { entityFactory } from './entity-factory';

// 存放所有实体类
const ENTITIES = new Map();

/**
 * 实体服务，用于管理注册的所有实体类。
 */
export class Entities {
    /**
     * 注册一个实体
     * @param {string} name - 实体名称
     * @param {object} desc - 实体的描述信息
     */
    static register(name, desc) {
        if (ENTITIES.has(name)) {
            throw new Error(`Entity ${name} is registered.`);
        }
        const Entity = entityFactory(name, desc);
        ENTITIES.set(name, Entity);
    }

    /**
     * 获取一个实体服务
     */
    static get(name) {
        if (!ENTITIES.has(name)) {
            throw new Error(`Entity ${name} not found.`);
        }
        return ENTITIES.get(name);
    }
}
