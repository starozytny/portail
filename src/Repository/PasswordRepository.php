<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

class PasswordRepository
{
    const TABLE = "password";

    /**
     * @var Connection The database connection
     */
    private $connection;

    /**
     * The constructor.
     *
     * @param Connection $connection The database connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function findOneByUsername($username)
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('*')
            ->from(self::TABLE)
            ->where('username = :username')
            ->setParameter('username', $username)
            ->execute()
            ->fetch()
            ;
    }

    public function findOneByToken($token)
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('*')
            ->from(self::TABLE)
            ->where('token = :token')
            ->setParameter('token', $token)
            ->execute()
            ->fetch()
            ;
    }
}