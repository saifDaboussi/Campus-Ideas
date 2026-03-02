import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../../app/models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion!: Suggestion;

  constructor(
    private route: ActivatedRoute,
    private service: SuggestionService
  ) {}

 
ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.service.getSuggestionById(id).subscribe({
    next: (data: any) => {
      this.suggestion = data.suggestion; 
      console.log('Suggestion chargée:', this.suggestion);
    },
    error: (err) => console.error('Erreur récupération suggestion:', err)
  });
}
}