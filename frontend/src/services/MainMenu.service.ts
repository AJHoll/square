import RootService from './Root.service';
import {makeAutoObservable} from 'mobx';
import {MainMenuGroupDto} from '../dtos/MainMenuGroup.dto';
import axios from 'axios';

export default class MainMenuService {
    private readonly rootService: RootService;
    private readonly _restPath: string;

    constructor(rootService: RootService) {
        this.rootService = rootService;
        this._restPath = `${this.rootService.restUrl}/main-menu`;
        makeAutoObservable(this);
    }

    async getMainMenu(menuFilter: string): Promise<MainMenuGroupDto[]> {
        return (await axios.get<MainMenuGroupDto[]>(this._restPath, {params: {menuFilter}})).data;
    }
}