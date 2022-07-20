package me.omartanner.modulepal.data.firebase.db;

import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;

public interface CheckedCallable<T> {
    T run() throws InterruptedException, ExecutionException, CancellationException, FirebaseDbException;
}
