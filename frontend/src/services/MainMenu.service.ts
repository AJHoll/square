import RootService from './Root.service';
import {makeAutoObservable} from 'mobx';
import {MainMenuGroupDto} from '../dtos/MainMenuGroup.dto';
import axios from 'axios';

export default class MainMenuService {
    private readonly rootService: RootService;

    get restPath(): string {
        return `${this.rootService.restUrl}/main-menu`;
    }

    constructor(rootService: RootService) {
        this.rootService = rootService;
        makeAutoObservable(this);
    }

    async getMainMenu(menuFilter: string): Promise<MainMenuGroupDto[]> {
        return (await axios.get<MainMenuGroupDto[]>(this.restPath, {params: {menuFilter}})).data;
    }
}