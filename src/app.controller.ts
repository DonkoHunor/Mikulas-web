/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { ujGyerekDTO } from './ujGyerekDTO';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mikulas'  
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok,mezok] = await connection.execute('SELECT id, nev, jo, ajandek FROM gyerekek');
    console.log(adatok);
    console.log(mezok);
    return { gyerekek: adatok };
  }

  @Get('gyerekek/:id')
  @Render('gyerek')
  async egyGyerek(@Param('id') id: number) {
    const [adatok] = await connection.execute('SELECT nev, jo, ajandek FROM gyerekek WHERE id=?', [id]);
    return adatok[0];
  }

  @Post('/ujGyerek')
  @Render('ujGyerek')
  async ujGyerek(@Body() ujGyerek: ujGyerekDTO) {
    const nev = ujGyerek.nev
    const jo: boolean = ujGyerek.jo == '1';
    const ajandek = jo ? ujGyerek.ajandek : null;

   const [adatok] = await connection.execute('INSERT INTO gyerekek (nev,jo, ajandek) VALUES (?,?,?)',[nev, jo, ajandek]);
   console.log(adatok);
   return{};
  }

  @Get('/ujGyerek')
  @Render('ujGyerek')
  ujGyerekForm() {
    return{};
  }
}
