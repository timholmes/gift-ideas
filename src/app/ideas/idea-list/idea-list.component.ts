import { Component, OnInit } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { listIdeas } from 'src/graphql/queries';
import { Idea } from 'src/API'


@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.css']
})
export class IdeaListComponent implements OnInit {

  ideas: Idea[] = [];

  constructor() { }

  ngOnInit(): void {
    let listPromise = API.graphql(graphqlOperation(listIdeas)) as Promise<any>;
    listPromise.then(
      ideasReply => {
        this._parseListIdeas(ideasReply);
      }
    );
  }

  _parseListIdeas(ideasReply: any) : void {
    console.log('ideas count: ' + ideasReply.data.listIdeas.items.length);
    if(ideasReply.data?.listIdeas?.items?.length > 0) {
      this.ideas = ideasReply.data.listIdeas.items
    }
  }
  
}
