import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

export function getUuid() { 
    return uuidv1();
}