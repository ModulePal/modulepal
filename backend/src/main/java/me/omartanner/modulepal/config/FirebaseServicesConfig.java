package me.omartanner.modulepal.config;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseServicesConfig {
    @Autowired
    private FirebaseApp firebaseApp;

    @Bean
    public FirebaseDatabase createFirebaseDatabase() {
        return FirebaseDatabase.getInstance(firebaseApp);
    }

    @Bean
    public FirebaseAuth createFirebaseAuth() {
        return FirebaseAuth.getInstance(firebaseApp);
    }

    @Bean
    public Firestore createFirestore() {
        return FirestoreClient.getFirestore(firebaseApp);
    }
}
