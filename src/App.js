import React, { useEffect, useState } from "react";
import api from './services/api';

import {SafeAreaView, View, FlatList, Text, StatusBar, StyleSheet, TouchableOpacity } from "react-native";


export default function App() {

//Criando um State para armazenar dados do nosso projetos
const [repositories, setRepositories] = useState([]);

useEffect(() => {
    api.get("/repositories").then(response => {
      console.log(response);
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    //Localiza dentro do array repositories obtido no UseEffect e gauda em uma const para usar na validação
    //verificando se diferente no setRepositories para se retornado    
    const repositoryFind = repositories.find(repositories => repositories.id === id);

    //Dispara para o backend a ID em busca do registro para incluir o like e retorna o resultado do backend
     const response = await api.post(`/repositories/${id}/like`);

     const repository = response.data;
     
     setRepositories([...repositories.filter((repository) => 
                { return repository.id !== repositoryFind.id }), repository]);

  }

  return (
    <>
       <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
       <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer}>
   
          <FlatList 
                        data={repositories}
                        keyExtractor={repository => repository.id}
                        renderItem={({ item: repository }) => (
                          <>
                              <Text style={styles.repository}>{repository.title}</Text>

                              <View style={styles.techsContainer}>
                                  {repository.techs.map( tech => (
                                      <Text key={tech} style={styles.tech}>
                                          {tech}
                                      </Text>
                                  ))}
                              </View>
                    
                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
              
                    testID={`repository-likes-${repository.id}`}>
                    
                    {repository.likes} {repository.likes === 1 ? "curtida" : "curtidas"}
                    
                  </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLikeRepository(repository.id)}
                   
                    testID={`like-button-${repository.id}`}>

                        <Text style={styles.buttonText}>Curtir</Text>

                </TouchableOpacity>
           </>
       )}>
    </FlatList> 

    </View>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
