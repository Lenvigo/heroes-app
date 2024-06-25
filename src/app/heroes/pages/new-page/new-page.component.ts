import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {


  public heroForm = new FormGroup({
    id: new FormControl<string>(""),
    superhero: new FormControl<string>("", { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(""),
    first_appearance: new FormControl<string>(""),
    characters: new FormControl<string>(""),
    alt_img: new FormControl("")

  });


  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics ' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics ' },
  ];



  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }


  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id)
        ),
      ).subscribe(hero => {
        if (!hero) { return this.router.navigateByUrl('/'); }
        this.heroForm.reset(hero);
        return;

      })

  }


  onSubmit(): void {

    console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value,  //value: this.heroForm.getRawValue(),
    })

    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          //TODO: mostrar snackbar

        });
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        //TODO: mostrar snackbar y navegar a hero.id
      });


  }
}


