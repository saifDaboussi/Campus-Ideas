import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  id!: number;
  isEditMode: boolean = false;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: SuggestionService,
    private actR: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // Création du formulaire
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      status: ['en attente'], // temporaire pour update readonly
      date: [new Date()]       // temporaire pour affichage
    });

    // 🔥 Vérification du mode update
    this.id = this.actR.snapshot.params['id'];
    if (this.id) {
      this.isEditMode = true;

      // Récupération des données depuis le backend
      this.service.getSuggestionById(this.id).subscribe((res: any) => {
        if(res.success && res.suggestion){
          this.suggestionForm.patchValue({
            ...res.suggestion,
            date: new Date(res.suggestion.date)
          });
        }
      });
    }
  }

  // Getters pour simplifier le template
  get title() { return this.suggestionForm.get('title')!; }
  get description() { return this.suggestionForm.get('description')!; }
  get category() { return this.suggestionForm.get('category')!; }

  onSubmit() {
    if (this.suggestionForm.invalid) return;

    const suggestion: Suggestion = {
      id: this.id || 0,
      ...this.suggestionForm.value,
      nbLikes: this.isEditMode ? this.suggestionForm.value.nbLikes || 0 : 0,
      date: this.isEditMode ? this.suggestionForm.value.date : new Date(),
      status: this.isEditMode ? this.suggestionForm.value.status : 'en attente'
    };

    if (!this.isEditMode) {
      // 🔥 Ajouter une nouvelle suggestion
      this.service.addSuggestion(suggestion).subscribe(() => {
        this.router.navigate(['/suggestions']);
      });
    } else {
      // 🔥 Mettre à jour la suggestion
      this.service.updateSuggestion(this.id, suggestion).subscribe(() => {
        this.router.navigate(['/suggestions']);
      });
    }
  }
}