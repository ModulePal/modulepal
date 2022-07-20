package me.omartanner.modulepal.data.firebase.db;

import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;

public interface CheckedRunnable {
    void run() throws InterruptedException, ExecutionException, CancellationException, FirebaseDbException;
}
